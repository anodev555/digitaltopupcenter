"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Key,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel as UICarousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CarouselOrientation = "card" | "desktop";

/**
 * Layout passed to renderItem. "auto" means the slide keeps its natural height,
 * so no aspect-ratio box is wrapped around it.
 */
export type CarouselLayout = CarouselOrientation | "auto";

/** Where the arrows and dots are rendered */
export type CarouselControls = "overlay" | "below" | "none";

/** Scroll direction. "rtl" scrolls the other way, useful for counter-moving rows */
export type CarouselDirection = "ltr" | "rtl";

const ORIENTATION_RATIO: Record<CarouselLayout, string> = {
  card: "aspect-[3/4]",
  desktop: "aspect-video",
  /** Plain slides keep their own height */
  auto: "",
};

/**
 * The UI Carousel hardcodes `-ml-4` on the track and `pl-4` on each slide, which
 * the shared carousel replaces with its own `gap`. For "rtl" those physical
 * left values are cleared inline and mirrored onto the right, so spacing stays
 * even on both edges.
 */
function contentGapStyle(gap: number, direction: CarouselDirection) {
  return direction === "rtl"
    ? { marginLeft: 0, marginRight: -gap }
    : { marginLeft: -gap };
}

function itemGapStyle(gap: number, direction: CarouselDirection) {
  return direction === "rtl"
    ? { paddingLeft: 0, paddingRight: gap }
    : { paddingLeft: gap };
}

function useCarouselState(api: CarouselApi | undefined) {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSelected(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api]);

  return { selected, count, canPrev, canNext };
}

function useAutoplay(autoplayMs?: number) {
  return useMemo(
    () =>
      autoplayMs && autoplayMs > 0
        ? [
            Autoplay({
              delay: autoplayMs,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]
        : [],
    [autoplayMs],
  );
}

function CarouselArrow({
  dir,
  onClick,
  disabled,
  className,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "size-9 rounded-lg bg-background/70 backdrop-blur",
        "hover:bg-foreground hover:text-background",
        className,
      )}
    >
      <Icon className="size-4" />
    </Button>
  );
}

function CarouselDots({
  count,
  active,
  onSelect,
  variant = "overlay",
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
  variant?: "overlay" | "plain";
}) {
  if (count <= 1) return null;
  return (
    <div
      className="flex items-center gap-1.5"
      role="tablist"
      aria-label="Slides"
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === active
              ? variant === "overlay"
                ? "w-6 bg-primary!"
                : "w-6 bg-foreground"
              : "w-1.5 bg-foreground/30 hover:bg-foreground/60",
          )}
        />
      ))}
    </div>
  );
}

function CarouselControlsRow({
  count,
  active,
  canPrev,
  canNext,
  onSelect,
  onPrev,
  onNext,
}: {
  count: number;
  active: number;
  canPrev: boolean;
  canNext: boolean;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (count <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <CarouselDots
        count={count}
        active={active}
        onSelect={onSelect}
        variant="plain"
      />

      <div className="flex items-center gap-2">
        <CarouselArrow
          dir="prev"
          onClick={onPrev}
          disabled={!canPrev}
          className="bg-background backdrop-blur-none"
        />
        <CarouselArrow
          dir="next"
          onClick={onNext}
          disabled={!canNext}
          className="bg-background backdrop-blur-none"
        />
      </div>
    </div>
  );
}

export type CarouselCardProps = {
  image?: string;
  alt?: string;
  children?: ReactNode;
  overlay?: "none" | "bottom" | "left" | "full";
  align?: "bottom-left" | "bottom-center" | "center" | "top-left";
  priority?: boolean;
  sizes?: string;
  className?: string;
  contentClassName?: string;
};

const OVERLAY: Record<NonNullable<CarouselCardProps["overlay"]>, string> = {
  none: "",
  bottom: "bg-linear-to-t from-black/75 via-black/20 to-transparent",
  left: "bg-linear-to-r from-black/75 via-black/25 to-transparent",
  full: "bg-black/45",
};

const ALIGN: Record<NonNullable<CarouselCardProps["align"]>, string> = {
  "bottom-left": "items-start justify-end text-left",
  "bottom-center": "items-center justify-end text-center",
  center: "items-center justify-center text-center",
  "top-left": "items-start justify-start text-left",
};

export function CarouselCard({
  image,
  alt = "",
  children,
  overlay = "bottom",
  align = "bottom-left",
  priority,
  sizes = "(min-width: 1024px) 50vw, 90vw",
  className,
  contentClassName,
}: CarouselCardProps) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-xl bg-muted text-white",
        className,
      )}
    >
      {image && (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      )}
      {overlay !== "none" && (
        <div aria-hidden className={cn("absolute inset-0", OVERLAY[overlay])} />
      )}
      {children && (
        <div
          className={cn(
            "relative z-1 flex size-full flex-col gap-2 p-4 sm:p-5",
            ALIGN[align],
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function BoardProgress({
  count,
  active,
  autoplay,
  fillRef,
  onSelect,
}: {
  count: number;
  active: number;
  autoplay: boolean;
  fillRef: RefObject<HTMLSpanElement | null>;
  onSelect: (i: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-5"
      role="tablist"
      aria-label="Slides"
    >
      <div className="pointer-events-auto flex items-center gap-1.5">
        {Array.from({ length: count }, (_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => onSelect(i)}
              className={cn(
                "relative h-1 overflow-hidden rounded-full bg-white/40 transition-[width] duration-300 sm:h-[5px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "w-16 sm:w-28" : "w-6 hover:bg-white/70 sm:w-9",
              )}
            >
              {isActive && (
                <span
                  ref={fillRef}
                  className="absolute inset-0 origin-left rounded-full bg-sky-500"
                  style={{ transform: autoplay ? "scaleX(0)" : "scaleX(1)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type BoardCarouselProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => Key;
  renderSlide: (item: T, index: number) => ReactNode;
  autoplayMs?: number;
  gap?: number;
  showArrows?: boolean;
  className?: string;
  slideClassName?: string;
};

type AutoplayLike = { timeUntilNext?: () => number | null };

function BoardCarousel<T>({
  items,
  getKey,
  renderSlide,
  autoplayMs,
  gap = 12,
  showArrows = false,
  className,
  slideClassName,
}: BoardCarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const { selected } = useCarouselState(api);
  const plugins = useAutoplay(autoplayMs);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const autoplay = plugins.length > 0;

  useEffect(() => {
    if (!api || !autoplayMs) return;
    let raf = 0;
    const tick = () => {
      const ap = api.plugins().autoplay as AutoplayLike | undefined;
      const left = ap?.timeUntilNext?.();
      if (typeof left === "number" && fillRef.current) {
        const p = Math.min(1, Math.max(0, 1 - left / autoplayMs));
        fillRef.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [api, autoplayMs]);

  return (
    <div className={cn("relative w-full", className)}>
      <UICarousel
        setApi={setApi}
        plugins={plugins}
        opts={{ loop: true, align: "center", duration: 30 }}
      >
        <CarouselContent style={{ marginLeft: -gap }}>
          {items.map((item, i) => {
            const isActive = i === selected;
            return (
              <CarouselItem
                key={getKey(item, i)}
                className="basis-[86%] md:basis-[72%]"
                style={{ paddingLeft: gap }}
              >
                <div
                  data-active={isActive}
                  onClickCapture={(e) => {
                    if (isActive) return;
                    e.preventDefault();
                    e.stopPropagation();
                    api?.scrollTo(i);
                  }}
                  className={cn(
                    "relative aspect-video md:aspect-25/9",
                    "cursor-pointer opacity-45 blur-[1.5px] brightness-90 grayscale-100 smooth",
                    "data-[active=true]:cursor-auto data-[active=true]:opacity-100 data-[active=true]:grayscale-0",
                    "data-[active=true]:blur-none data-[active=true]:brightness-100",
                    slideClassName,
                  )}
                >
                  <div className="absolute inset-0">{renderSlide(item, i)}</div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </UICarousel>

      {showArrows && items.length > 1 && (
        <>
          <CarouselArrow
            dir="prev"
            onClick={() => api?.scrollPrev()}
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 md:grid"
          />
          <CarouselArrow
            dir="next"
            onClick={() => api?.scrollNext()}
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 md:grid"
          />
        </>
      )}

      <BoardProgress
        count={items.length}
        active={selected}
        autoplay={autoplay}
        fillRef={fillRef}
        onSelect={(i) => api?.scrollTo(i)}
      />
    </div>
  );
}

export type CarouselBoardProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => Key;
  renderItem?: (item: T, index: number) => ReactNode;
  getImage?: (item: T, index: number) => string | undefined;
  getAlt?: (item: T, index: number) => string;
  renderContent?: (item: T, index: number) => ReactNode;
  overlay?: CarouselCardProps["overlay"];
  align?: CarouselCardProps["align"];
  gap?: number;
  autoplayMs?: number;
  showArrows?: boolean;
  className?: string;
  slideClassName?: string;
};

export function CarouselBoard<T>({
  items,
  getKey,
  renderItem,
  getImage,
  getAlt,
  renderContent,
  overlay = "none",
  align = "bottom-left",
  gap,
  autoplayMs = 5000,
  showArrows = false,
  className,
  slideClassName,
}: CarouselBoardProps<T>) {
  return (
    <BoardCarousel
      items={items}
      getKey={getKey}
      gap={gap}
      autoplayMs={autoplayMs}
      showArrows={showArrows}
      className={className}
      slideClassName={slideClassName}
      renderSlide={(item, i) =>
        renderItem ? (
          renderItem(item, i)
        ) : (
          <CarouselCard
            image={getImage?.(item, i)}
            alt={getAlt?.(item, i)}
            overlay={overlay}
            align={align}
            priority={i === 0}
            className="rounded-2xl"
          >
            {renderContent?.(item, i)}
          </CarouselCard>
        )
      }
    />
  );
}

export type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number, layout: CarouselLayout) => ReactNode;
  getKey: (item: T, index: number) => Key;
  perView?: 1 | 2;
  /** "auto" keeps each slide at its natural height; "card"/"desktop" add a fixed aspect ratio */
  orientation?: CarouselLayout;
  gap?: number;
  autoplayMs?: number;
  /** Default: true for "card"/"desktop" layouts, false for "auto" */
  loop?: boolean;
  /** Where the arrows and dots go. Default: "overlay", or "below" for "auto" */
  controls?: CarouselControls;
  /** Scroll direction. Default: "ltr"; "rtl" makes the row move the other way */
  direction?: CarouselDirection;
  /** Basis classes for each slide, e.g. "basis-full md:basis-1/2 lg:basis-1/4" */
  itemClassName?: string;
  /** Extra classes for the scrolling track */
  contentClassName?: string;
  className?: string;
};

const BASIS: Record<1 | 2, string> = {
  1: "basis-full",
  2: "basis-1/2",
};

function BasicCarousel<T>({
  items,
  renderItem,
  getKey,
  perView = 1,
  orientation = "desktop",
  gap = 12,
  autoplayMs,
  loop = true,
  controls = "overlay",
  direction = "ltr",
  itemClassName,
  contentClassName,
  className,
}: CarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const { selected, count, canPrev, canNext } = useCarouselState(api);
  const plugins = useAutoplay(autoplayMs);
  const ratio = ORIENTATION_RATIO[orientation];

  return (
    <div className={cn("relative w-full", className)}>
      <UICarousel
        setApi={setApi}
        plugins={plugins}
        opts={{ loop, align: "start", direction }}
      >
        <CarouselContent
          className={contentClassName}
          style={contentGapStyle(gap, direction)}
        >
          {items.map((item, i) => (
            <CarouselItem
              key={getKey(item, i)}
              className={cn(BASIS[perView], itemClassName)}
              style={itemGapStyle(gap, direction)}
            >
              <div className={cn("relative", ratio)}>
                <div className="absolute inset-0">
                  {renderItem(item, i, orientation)}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </UICarousel>

      {controls === "overlay" ? (
        <>
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1">
            <CarouselArrow dir="prev" onClick={() => api?.scrollPrev()} />
            <CarouselArrow dir="next" onClick={() => api?.scrollNext()} />
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <CarouselDots
              count={count}
              active={selected}
              onSelect={(i) => api?.scrollTo(i)}
            />
          </div>
        </>
      ) : null}

      {controls === "below" ? (
        <CarouselControlsRow
          count={count}
          active={selected}
          canPrev={canPrev}
          canNext={canNext}
          onSelect={(i) => api?.scrollTo(i)}
          onPrev={() => api?.scrollPrev()}
          onNext={() => api?.scrollNext()}
        />
      ) : null}
    </div>
  );
}

function PlainCarousel<T>({
  items,
  renderItem,
  getKey,
  perView = 1,
  orientation = "auto",
  gap = 16,
  autoplayMs,
  loop = false,
  controls = "below",
  direction = "ltr",
  itemClassName,
  contentClassName,
  className,
}: CarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const { selected, count, canPrev, canNext } = useCarouselState(api);
  const plugins = useAutoplay(autoplayMs);

  return (
    <div className={cn("relative w-full", className)}>
      <UICarousel
        setApi={setApi}
        plugins={plugins}
        opts={{ loop, align: "start", direction }}
      >
        <CarouselContent
          className={contentClassName}
          style={contentGapStyle(gap, direction)}
        >
          {items.map((item, i) => (
            <CarouselItem
              key={getKey(item, i)}
              className={cn(BASIS[perView], itemClassName)}
              style={itemGapStyle(gap, direction)}
            >
              {renderItem(item, i, orientation)}
            </CarouselItem>
          ))}
        </CarouselContent>
      </UICarousel>

      {controls === "below" ? (
        <CarouselControlsRow
          count={count}
          active={selected}
          canPrev={canPrev}
          canNext={canNext}
          onSelect={(i) => api?.scrollTo(i)}
          onPrev={() => api?.scrollPrev()}
          onNext={() => api?.scrollNext()}
        />
      ) : null}
    </div>
  );
}

export function Carousel<T>(props: CarouselProps<T>) {
  const { orientation = "desktop", perView = 1 } = props;

  if (orientation === "auto") {
    return <PlainCarousel {...props} />;
  }

  if (orientation === "desktop" && perView === 1) {
    return (
      <BoardCarousel
        items={props.items}
        getKey={props.getKey}
        gap={props.gap || undefined}
        autoplayMs={props.autoplayMs}
        className={props.className}
        renderSlide={(item, i) => props.renderItem(item, i, "desktop")}
      />
    );
  }

  return <BasicCarousel {...props} />;
}
