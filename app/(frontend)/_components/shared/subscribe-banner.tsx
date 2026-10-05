"use client";

import { useState } from "react";
import Image from "next/image";
import { Gamepad2, Loader2, Mail, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SubscribeBannerProps = {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  image?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubscribe?: (email: string) => Promise<void>;
  className?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeBanner({
  eyebrow = "Join the squad",
  title = "Never miss a",
  highlight = "top-up deal",
  description = "Be the first to hear about flash sales, new game top-ups and limited-time rewards. No spam, just the good stuff, straight to your inbox.",
  image = "/images/banner.webp",
  placeholder = "Enter your email address",
  buttonLabel = "Subscribe",
  onSubscribe,
  className,
}: SubscribeBannerProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      await onSubscribe?.(email.trim());
      setStatus("success");
      setMessage("You're in! Check your inbox for a confirmation.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border-2 border-border bg-card",
        className,
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="-z-20 object-cover object-center grayscale-100"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/70 to-black/50"
      />

      <div className="grid items-center gap-6 p-6 md:grid-cols-2 md:gap-10">
        <div className="space-y-3 text-white">
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Gamepad2 className="size-3.5 text-lime-400" />
            {eyebrow}
          </span>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title} <span className="text-lime-400">{highlight}</span>
          </h2>

          <p className="max-w-md text-sm leading-relaxed text-white/75">
            {description}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="flex gap-1 border-white/20 bg-white/10 p-0.5 text-white backdrop-blur placeholder:text-white/50 rounded-lg">
            <div className="relative flex flex-1 items-center gap-2 px-3">
              <Mail className="size-5 pointer-events-none text-white/60" />
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder={placeholder}
                aria-label="Email address"
                aria-invalid={status === "error"}
                disabled={status === "loading"}
                className="font-medium p-0! border-none! border-0! outline-0! bg-transparent! rounded-none!"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={status === "loading"}
              className="gap-2 px-4"
            >
              {status === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : status === "success" ? (
                <Check className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
              {buttonLabel}
            </Button>
          </div>

          <p
            role="status"
            aria-live="polite"
            className={cn(
              "min-h-5 text-sm font-medium",
              status === "success" && "text-lime-400",
              status === "error" && "text-red-400",
              (status === "idle" || status === "loading") && "text-white/50",
            )}
          >
            {message ||
              "We respect your inbox. Unsubscribe anytime with one click."}
          </p>
        </form>
      </div>
    </section>
  );
}
