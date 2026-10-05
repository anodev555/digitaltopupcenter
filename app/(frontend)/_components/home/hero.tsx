"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ShieldCheck, Headset, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/shared/search-bar";
import { CarouselBoard, CarouselOrientation } from "../shared/carousel";

export type HeroFeature = { icon: LucideIcon; label: string };

export type HeroPackage = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
};

export type HeroProps = {
  image?: string;
  preload?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: HeroFeature[];
  packages?: HeroPackage[];
  className?: string;
};

const DEFAULT_FEATURES: HeroFeature[] = [
  { icon: Zap, label: "Fast delivery" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Headset, label: "Real support" },
];

const DEFAULT_PACKAGES: HeroPackage[] = [
  {
    id: "ff",
    title: "Free Fire",
    subtitle: "Diamonds",
    image:
      "https://seagm-media.seagmcdn.com/activity/Nintendo20260924_w.jpg?x-oss-process=image/resize,w_2000,limit_0",
    href: "/shop/free-fire",
  },
  {
    id: "pubg",
    title: "PUBG Mobile",
    subtitle: "UC",
    image:
      "https://seagm-media.seagmcdn.com/activity/pubg20260911_w.jpg?x-oss-process=image/resize,w_2000,limit_0",
    href: "/shop/pubg",
  },
  {
    id: "roblox",
    title: "Roblox",
    subtitle: "Robux",
    image:
      "https://i.pinimg.com/1200x/86/db/d1/86dbd14d4b42d9f502d86a18491062ad.jpg",
    href: "/shop/roblox",
  },
  {
    id: "ml",
    title: "Mobile Legends",
    subtitle: "Diamonds",
    image:
      "https://i.pinimg.com/1200x/31/c1/a5/31c1a5c1ea184e099887fee3f52fd1ca.jpg",
    href: "/shop/mobile-legends",
  },
];

const SHARP_MASK =
  "linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.6) 64%, transparent 86%)";

const BLUR_MASK =
  "linear-gradient(to bottom, transparent 0%, transparent 38%, #000 66%, transparent 94%)";

function MaskedBackground({
  src,
  mask,
  blurred,
  preload,
  className,
}: {
  src: string;
  mask: string;
  blurred?: boolean;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-x-0 top-0 h-4/5", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div className={cn("absolute inset-0", blurred && "blur-xl")}>
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          preload={blurred ? undefined : preload}
          className="object-cover object-[50%_35%] grayscale-100"
        />
      </div>
    </div>
  );
}

function FeatureList({ items }: { items: HeroFeature[] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2 text-sm font-medium">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/80 text-white">
            <Icon className="size-4" />
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}

function PackageCard({
  pkg,
  orientation,
}: {
  pkg: HeroPackage;
  orientation: CarouselOrientation;
}) {
  return (
    <Link
      href={pkg.href}
      className="group relative block size-full overflow-hidden rounded-xl bg-card"
    >
      <Image
        src={pkg.image}
        alt={pkg.title}
        fill
        sizes={
          orientation === "card"
            ? "(min-width: 1024px) 45vw, 45vw"
            : "(min-width: 1024px) 45vw, 90vw"
        }
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 text-white">
        <p className="font-semibold leading-tight">{pkg.title}</p>
        {pkg.subtitle ? (
          <p className="text-xs text-white/70">{pkg.subtitle}</p>
        ) : null}
      </div>
    </Link>
  );
}

export default function Hero({
  image = "/images/banner_black.png",
  preload = true,
  title = "Top up any game in minutes",
  description = "Free Fire, PUBG, Roblox and more. Pay with eSewa, Khalti or bank.",
  features = DEFAULT_FEATURES,
  packages = DEFAULT_PACKAGES,
  className,
}: HeroProps) {
  return (
    <section
      className={cn("relative isolate w-full overflow-hidden", className)}
    >
      <MaskedBackground src={image} mask={BLUR_MASK} blurred className="z-10" />
      <MaskedBackground
        src={image}
        mask={SHARP_MASK}
        preload={preload}
        className="z-10"
      />

      <div className="relative z-40 mx-auto max-w-7xl items-center px-6 pt-12 pb-6 space-y-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 ">
          <div className="space-y-3">
            {/* <p className="text-sm font-medium uppercase tracking-wider text-primary">
              {eyebrow}
            </p> */}
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-lg text-base text-foreground font-medium">
              {description}
            </p>

            <Suspense fallback={null}>
              <SearchBar
                variant="dialog"
                trigger="input"
                basePath="/shop"
                placeholder="Search games, diamonds, UC, Robux…"
                className="w-full max-w-md"
              />
            </Suspense>

            <FeatureList items={features} />
          </div>

          {/* <div className="min-w-0">
            <Carousel
              perView={2}
              items={packages}
              orientation="card"
              getKey={(p) => p.id}
              renderItem={(p, _i, orientation) => (
                <PackageCard pkg={p} orientation={orientation} />
              )}
              autoplayMs={4000}
            />
          </div> */}
        </div>
        <CarouselBoard
          items={packages}
          getKey={(p) => p.id}
          autoplayMs={4000}
          renderItem={(p) => <PackageCard pkg={p} orientation="desktop" />}
        />
      </div>
    </section>
  );
}
