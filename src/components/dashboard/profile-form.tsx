"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authApi, API_URL } from "@/lib/api";
import { initials } from "@/lib/format";
import type { AppUser } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(200).optional(),
  image: z.union([z.url("Enter a valid image URL"), z.literal("")]).optional(),
});

type Values = z.infer<typeof schema>;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({ user }: { user: AppUser }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user.image ?? "");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      image: user.image ?? "",
    },
  });

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large", { description: "Maximum size is 5MB." });
      return;
    }

    setUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await fetch(`${API_URL}/api/uploads/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Upload failed");

      form.setValue("image", body.data.url, { shouldValidate: true });
      setPreview(body.data.url);
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error("Could not upload photo", {
        description:
          error instanceof Error
            ? `${error.message} You can paste a URL instead.`
            : "Paste a direct image URL instead.",
      });
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function onSubmit(values: Values) {
    setSaving(true);

    try {
      await authApi("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: values.name,
          phone: values.phone ?? "",
          address: values.address ?? "",
          image: values.image ?? "",
        }),
      });

      toast.success("Profile updated");
      router.refresh();
    } catch (error) {
      toast.error("Could not update profile", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-6">
        <div className="grid size-24 place-items-center overflow-hidden rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={user.name} className="size-full object-cover" />
          ) : (
            initials(user.name)
          )}
        </div>
        <p className="mt-4 font-heading text-lg">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <span className="mt-3 inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium capitalize">
          {user.role}
        </span>

        <div className="mt-5 border-t border-border pt-5">
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadPhoto(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            Change photo
          </Button>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Upload to imgbb or paste a direct image URL in the form.
          </p>
        </div>
      </aside>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-card p-6"
        noValidate
      >
        <h2 className="font-heading text-lg">Personal information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your contact details current so owners and renters can reach you.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" className="h-11" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="h-11" value={user.email} disabled />
            <p className="text-[11px] text-muted-foreground">
              Email is used for sign-in and cannot be changed here.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              className="h-11"
              placeholder="+1 (512) 555-0100"
              {...form.register("phone")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Profile image URL</Label>
            <Input
              id="image"
              className="h-11"
              placeholder="https://example.com/photo.jpg"
              {...form.register("image")}
            />
            {form.formState.errors.image ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.image.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              rows={3}
              placeholder="Street, city, state and ZIP"
              {...form.register("address")}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-border pt-5">
          <Button type="submit" className="h-10 px-5" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
