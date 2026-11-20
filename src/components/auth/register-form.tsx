"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  UploadCloud,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter"),
  image: z
    .union([z.url("Enter a valid image URL"), z.literal("")])
    .optional(),
  role: z.enum(["customer", "owner"]),
});

type Values = z.infer<typeof schema>;

const ROLES = [
  {
    value: "customer" as const,
    title: "I'm renting",
    description: "Browse and book equipment",
    icon: UserRound,
  },
  {
    value: "owner" as const,
    title: "I'm listing",
    description: "Rent out my equipment",
    icon: Wrench,
  },
];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

export function RegisterForm() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
      role: "customer",
    },
  });

  const role = form.watch("role");
  const password = form.watch("password") ?? "";
  const rules = [
    { label: "6+ characters", met: password.length >= 6 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
  ];

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file", { description: "PNG, JPG or WebP." });
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

      if (!response.ok) {
        throw new Error(body.message ?? "Upload failed");
      }

      const url = body.data.url as string;
      form.setValue("image", url, { shouldValidate: true });
      setPreview(url);
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error("Could not upload photo", {
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
    setSubmitting(true);

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image || undefined,
      role: values.role,
    });

    if (error) {
      toast.error("Could not create your account", {
        description: error.message ?? "Try a different email address.",
      });
      setSubmitting(false);
      return;
    }

    toast.success("Account created", {
      description:
        values.role === "owner"
          ? "Add your first listing from the owner dashboard."
          : "Your customer dashboard is ready.",
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <p className="label-mono text-muted-foreground">Join GearNest</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Create your account</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        One account for renting gear or listing your own. You can switch
        between dashboards later.
      </p>

      <div className="mt-8">
        <GoogleButton label="Sign up with Google" />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Google accounts start as customers.
        </p>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="label-mono text-muted-foreground">or use email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <Label className="mb-2 block">I want to</Label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((option) => {
              const active = role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    form.setValue("role", option.value, { shouldValidate: true })
                  }
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <option.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{option.title}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="h-11"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="image">Photo</Label>
          <div className="flex gap-2">
            <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <ImagePlus className="size-4 text-muted-foreground" />
              )}
            </div>
            <Input
              id="image"
              placeholder="https://example.com/photo.jpg"
              className="h-11"
              {...form.register("image")}
            />
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
              className="h-11 shrink-0"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UploadCloud className="size-4" />
              )}
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a direct link or upload to imgbb. Optional.
          </p>
          {form.formState.errors.image ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.image.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="h-11 pr-11"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-1 top-1 grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {rules.map((rule) => (
              <span
                key={rule.label}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px]",
                  rule.met ? "text-primary" : "text-muted-foreground",
                )}
              >
                {rule.met ? (
                  <Check className="size-3" />
                ) : (
                  <X className="size-3" />
                )}
                {rule.label}
              </span>
            ))}
          </div>
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By creating an account you agree to GearNest&apos;s rental terms and
          privacy policy.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
