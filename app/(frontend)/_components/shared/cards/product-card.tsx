"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  tag?: string;
  reviews: number;
  orders: number;
  wishlisted?: boolean;
};

export type ProductCardProps = {
  product: Product;
  currency?: string;
  locale?: string;
  onWishlistChange?: (id: string, wishlisted: boolean) => void;
  className?: string;
};

const SHINE =
  "linear-gradient(115deg, transparent 0 20%, rgba(255,255,255,.14) 46% 60%, transparent 60% 70%, rgba(255,255,255,.1) 70% 80%, transparent 80%)";

const compact = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function ProductCard({
  product,
  currency = "NPR",
  locale = "en-US",
  onWishlistChange,
  className,
}: ProductCardProps) {
  const {
    id,
    title,
    subtitle,
    image,
    href,
    price,
    originalPrice,
    reviews,
    orders,
  } = product;

  const [wishlisted, setWishlisted] = useState(product.wishlisted ?? false);

  const discount =
    product.discount ??
    (originalPrice && originalPrice > price
      ? ((originalPrice - price) / originalPrice) * 100
      : 0);

  const money = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  const toggleWishlist = () => {
    const next = !wishlisted;
    setWishlisted(next);
    onWishlistChange?.(id, next);
  };

  return (
    <article
      className={cn(
        "group relative smooth motion-safe:hover:-translate-y-0.5 overflow-hidden rounded-xl",
        className,
      )}
    >
      <div className="smooth relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-border bg-card group-hover:bg-primary/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1"
          style={{ backgroundImage: SHINE }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="relative size-20 overflow-hidden rounded-tl-lg bg-white/10 shadow-sm border-r-2 border-border">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold leading-tight">
                <Link
                  href={href}
                  className="after:absolute after:inset-0 after:z-5 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
                >
                  {title}
                </Link>
              </h3>
              {subtitle ? (
                <p className="mt-0.5 truncate text-xs text-white/75 font-medium">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <ul className="flex items-center gap-4 text-xs text-foreground/80">
              <li
                className="flex items-center gap-1.5"
                title={`${reviews} reviews`}
              >
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{compact(reviews, locale)}</span>
                <span className="sr-only">reviews</span>
              </li>
              <li
                className="flex items-center gap-1.5"
                title={`${orders} orders`}
              >
                <ShoppingBag className="size-3.5" />
                <span className="tabular-nums">{compact(orders, locale)}</span>
                <span className="sr-only">orders</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-2 border-t-2 border-border bg-card px-3 py-2 text-xs">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-sm font-bold tabular-nums">
              {money(price)}
            </span>
            {originalPrice && originalPrice > price ? (
              <span className="truncate tabular-nums text-foreground/50 line-through">
                {money(originalPrice)}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {discount > 0 ? (
              <span className="shrink-0 rounded bg-primary px-2 py-0.5 font-semibold tabular-nums text-white">
                -{discount.toFixed(0)}%
              </span>
            ) : null}

            {/*
              The title <Link> stretches across the whole card with
              `after:absolute after:inset-0 after:z-5`. This button has to be
              positioned above that overlay - unpositioned it renders
              underneath it and every click navigates instead of toggling.
            */}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-pressed={wishlisted}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className={cn(
                "relative z-10 grid size-7 shrink-0 place-items-center rounded-md",
                "text-foreground/70 outline-none transition-colors",
                "hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <Bookmark
                className={cn(
                  "size-4 smooth transition-colors group-hover:text-white",
                  wishlisted && "fill-lime-400 text-lime-400",
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
