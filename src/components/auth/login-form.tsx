"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type Values = z.infer<typeof schema>;

const DEMO = [
  { label: "Customer", email: "customer@gearnest.com", password: "Customer123" },
  { label: "Owner", email: "owner@gearnest.com", password: "Owner123" },
  { label: "Admin", email: "admin@gearnest.com", password: "Admin123" },
];

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    setSubmitting(true);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error("Could not sign you in", {
        description: error.message ?? "Check your email and password.",
      });
      setSubmitting(false);
      return;
    }

    toast.success("Welcome back", { description: "Taking you to your dashboard." });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <p className="label-mono text-muted-foreground">Welcome back</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Sign in to GearNest</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Manage bookings, favourite gear and track your rentals in one place.
      </p>

      <div className="mt-8">
        <GoogleButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="label-mono text-muted-foreground">or use email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
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
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to GearNest?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <details className="mt-8 rounded-xl border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Demo accounts for reviewers
        </summary>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Seeded accounts — click one to fill the form.
        </p>
        <div className="mt-3 space-y-2">
          {DEMO.map((account) => (
            <div
              key={account.email}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium">{account.label}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {account.email}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => {
                  form.setValue("email", account.email);
                  form.setValue("password", account.password);
                }}
              >
                Fill
              </Button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
