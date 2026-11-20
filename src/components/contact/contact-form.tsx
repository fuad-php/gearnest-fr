"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, publicApi } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Add a short subject").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Add a little more detail (10+ characters)")
    .max(3000, "Keep it under 3000 characters"),
});

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: Values) {
    setSubmitting(true);

    try {
      await publicApi<{ message: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
      });
      toast.success("Message sent", {
        description: "We reply within one business day.",
      });
      setSent(true);
      form.reset();
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        toast.error("Too many messages", {
          description: "Please wait a little before sending another.",
        });
      } else {
        toast.error("Could not send your message", {
          description: error instanceof Error ? error.message : "Try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-5 font-heading text-xl">Message received</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. Our team replies within one business day,
          Monday to Saturday.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 h-10"
          onClick={() => setSent(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            className="h-11"
            placeholder="Jordan Blake"
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
            className="h-11"
            placeholder="you@company.com"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          className="h-11"
          placeholder="Question about a booking"
          aria-invalid={Boolean(form.formState.errors.subject)}
          {...form.register("subject")}
        />
        {form.formState.errors.subject ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell us what you need — dates, equipment, or the issue you hit."
          aria-invalid={Boolean(form.formState.errors.message)}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="mt-5 h-11 w-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {submitting ? "Sending…" : "Send message"}
      </Button>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        We use your details only to reply to this message. No marketing lists, no
        sharing with owners without your permission.
      </p>
    </form>
  );
}
