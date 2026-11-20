"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/api";
import { CATEGORY_LABELS, RENTAL_TYPES } from "@/lib/categories";
import { uploadImage } from "@/lib/upload";
import type { Equipment } from "@/types";

const schema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(120),
  description: z
    .string()
    .trim()
    .min(20, "Describe the equipment in at least 20 characters")
    .max(4000),
  category: z.string().min(2, "Choose a category"),
  location: z.string().trim().min(2, "Add a pickup or delivery location").max(120),
  price: z
    .number({ error: "Enter a price" })
    .positive("Price must be greater than zero")
    .max(1_000_000),
  rentalType: z.enum(["daily", "weekly", "monthly"]),
  quantity: z
    .number({ error: "Enter a quantity" })
    .int("Quantity must be a whole number")
    .min(1, "At least one unit")
    .max(10_000),
  condition: z.string().trim().min(2, "Add the equipment condition").max(60),
  brand: z.string().trim().max(80).optional(),
  model: z.string().trim().max(80).optional(),
  image: z.url("Enter a valid image URL"),
  terms: z
    .string()
    .trim()
    .min(10, "Explain the rental terms in at least 10 characters")
    .max(4000),
});

type Values = z.infer<typeof schema>;

const CONDITIONS = ["Excellent", "Good", "Fair", "Needs service"];

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function EquipmentForm({ initial }: { initial?: Equipment }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initial?.image ?? "");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      category: initial?.category ?? CATEGORY_LABELS[0],
      location: initial?.location ?? "",
      price: initial?.price ?? 0,
      rentalType: initial?.rentalType ?? "daily",
      quantity: initial?.quantity ?? 1,
      condition: initial?.condition ?? "Excellent",
      brand: initial?.brand ?? "",
      model: initial?.model ?? "",
      image: initial?.image ?? "",
      terms: initial?.terms ?? "",
    },
  });

  async function handleUpload(file: File) {
    setUploading(true);

    try {
      const url = await uploadImage(file);
      form.setValue("image", url, { shouldValidate: true });
      setPreview(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Could not upload the image", {
        description:
          error instanceof Error
            ? `${error.message} You can paste a direct image URL instead.`
            : "Paste a direct image URL instead.",
      });
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function onSubmit(values: Values) {
    setSaving(true);

    const payload = {
      ...values,
      brand: values.brand ?? "",
      model: values.model ?? "",
    };

    try {
      if (initial) {
        await authApi(`/api/equipment/${initial.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Listing updated");
      } else {
        await authApi("/api/equipment", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Listing submitted for review", {
          description: "An admin will approve it before it appears publicly.",
        });
      }

      router.push("/dashboard/owner/equipment");
      router.refresh();
    } catch (error) {
      toast.error(initial ? "Could not update the listing" : "Could not create the listing", {
        description: error instanceof Error ? error.message : "Try again.",
      });
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
      noValidate
    >
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-1.5">
          <Label htmlFor="name">Equipment name</Label>
          <Input
            id="name"
            className="h-11"
            placeholder="CAT 320 Excavator"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="What is it, what is included and what should renters know?"
            aria-invalid={Boolean(form.formState.errors.description)}
            {...form.register("description")}
          />
          {form.formState.errors.description ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <select id="category" className={selectClass} {...form.register("category")}>
              {CATEGORY_LABELS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              className="h-11"
              placeholder="Austin, TX"
              aria-invalid={Boolean(form.formState.errors.location)}
              {...form.register("location")}
            />
            {form.formState.errors.location ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.location.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              className="h-11 font-mono"
              aria-invalid={Boolean(form.formState.errors.price)}
              {...form.register("price", { valueAsNumber: true })}
            />
            {form.formState.errors.price ? (
              <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rentalType">Rental type</Label>
            <select id="rentalType" className={selectClass} {...form.register("rentalType")}>
              {RENTAL_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              inputMode="numeric"
              className="h-11 font-mono"
              aria-invalid={Boolean(form.formState.errors.quantity)}
              {...form.register("quantity", { valueAsNumber: true })}
            />
            {form.formState.errors.quantity ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.quantity.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="condition">Condition</Label>
            <select id="condition" className={selectClass} {...form.register("condition")}>
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand (optional)</Label>
            <Input id="brand" className="h-11" placeholder="Caterpillar" {...form.register("brand")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model">Model (optional)</Label>
            <Input id="model" className="h-11" placeholder="320 GC" {...form.register("model")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="terms">Rental terms</Label>
          <Textarea
            id="terms"
            rows={3}
            placeholder="Deposits, fuel, delivery, return conditions…"
            aria-invalid={Boolean(form.formState.errors.terms)}
            {...form.register("terms")}
          />
          {form.formState.errors.terms ? (
            <p className="text-xs text-destructive">{form.formState.errors.terms.message}</p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <Label htmlFor="image">Equipment image</Label>
          <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Equipment preview" className="size-full object-cover" />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImagePlus className="size-6" />
                <span className="text-xs">No image yet</span>
              </div>
            )}
          </div>

          <Input
            id="image"
            className="mt-3 h-11"
            placeholder="https://example.com/photo.jpg"
            aria-invalid={Boolean(form.formState.errors.image)}
            {...form.register("image")}
          />
          {form.formState.errors.image ? (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.image.message}
            </p>
          ) : null}

          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            PNG, JPG or WebP up to 5MB. Uploaded through the API so the imgbb key
            stays private.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-[#14231c] p-5 text-[#f6f3ec]">
          <p className="label-mono text-[#8fa197]">
            {initial ? "Editing a listing" : "Before you publish"}
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#b9c4bd]">
            <li>Use a real photo of the actual equipment.</li>
            <li>Set a rate you are happy to honour.</li>
            <li>New listings are reviewed by an admin.</li>
            <li>You can edit or remove a listing at any time.</li>
          </ul>
        </div>

        <Button type="submit" className="h-11 w-full" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving
            ? "Saving…"
            : initial
              ? "Save changes"
              : "Submit listing for review"}
        </Button>
      </aside>
    </form>
  );
}
