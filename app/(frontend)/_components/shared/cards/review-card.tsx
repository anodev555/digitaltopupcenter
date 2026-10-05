"use client";

import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type Review = {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  comment?: string;
  createdAt: Date | string;
  verified?: boolean;
  game?: string;
};

export type ReviewCardProps = {
  review: Review;
  className?: string;
};

const SHINE =
  "linear-gradient(50deg, transparent 0 20%, rgba(255,255,255,.14) 55% 70%, transparent 40% 70%)";

const getInitials = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase() || "?";

const timeAgo = (value: Date | string) => {
  const diff = (new Date(value).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs)
      return rtf.format(Math.round(diff / secs), unit);
  }
  return "just now";
};

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const { username, avatar, rating, comment, createdAt, verified } = review;

  const stars = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <article
      className={cn(
        "group smooth motion-safe:hover:-translate-y-0.5 h-full",
        className,
      )}
    >
      <div className="smooth relative flex h-full flex-col overflow-hidden rounded-xl border-b-5 border-l-5 border-border bg-card group-hover:bg-primary/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1"
          style={{ backgroundImage: SHINE }}
        />

        <div className="relative z-2 flex items-start justify-between gap-3 p-3 pb-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-border bg-primary/20 text-sm font-semibold text-primary group-hover:text-white smooth">
              {avatar ? (
                <Image
                  src={avatar}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                getInitials(username)
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">
                {username}
              </p>
              <div className="flex items-center gap-2">
                <p
                  className="text-xs text-foreground/60"
                  suppressHydrationWarning
                >
                  {timeAgo(createdAt)}
                </p>

                {verified ? (
                  <span className="inline-flex text-xs items-center gap-1 font-medium text-emerald-400">
                    <BadgeCheck className="size-3" />
                    Verified
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className="flex shrink-0 items-center gap-0.5"
            role="img"
            aria-label={`Rated ${stars} out of 5`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < stars
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-foreground/25",
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative z-2 flex-1 px-3 pb-3">
          {comment ? (
            <p className="line-clamp-3 text-xs leading-4 text-foreground/85 font-medium">
              {comment}
            </p>
          ) : (
            <p className="text-sm italic text-foreground/60">
              Rated {stars} {stars === 1 ? "star" : "stars"}, no review written.
            </p>
          )}
        </div>

        {/* <div className="relative z-2 flex flex-wrap items-center gap-2 border-t-2 border-border bg-card px-3 py-2 text-xs">
          {game ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 font-semibold text-orange-400">
              <Flame className="size-3.5" />
              {game}
            </span>
          ) : null}
        </div> */}
      </div>
    </article>
  );
}
