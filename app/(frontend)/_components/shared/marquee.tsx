"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Key,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type MarqueeDirection = "left" | "right" | "up" | "down";

export type MarqueeProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  direction?: MarqueeDirection;
  speed?: number;
  gap?: number;
  repeat?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  paused?: boolean;
  fade?: boolean | number;
  label?: string;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
};

export default function Marquee<T>({
  items,
  getKey,
  renderItem,
  direction = "left",
  speed = 40,
  gap = 16,
  repeat = 2,
  pauseOnHover = true,
  pauseOnFocus = true,
  paused = false,
  fade = true,
  label,
  className,
  trackClassName,
  itemClassName,
}: MarqueeProps<T>) {
  const vertical = direction === "up" || direction === "down";
  const reverse = direction === "right" || direction === "down";

  const firstCopy = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = firstCopy.current;
    if (!el) return;

    const measure = () => {
      const size = vertical ? el.offsetHeight : el.offsetWidth;
      if (size > 0) setDuration((size + gap) / Math.max(1, speed));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vertical, gap, speed, items]);

  if (items.length === 0) return null;

  const isPaused =
    paused || (pauseOnHover && hovered) || (pauseOnFocus && focused);

  const fadePct = fade === true ? 8 : fade === false ? 0 : fade;
  const mask = fadePct
    ? `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent, #000 ${fadePct}%, #000 ${100 - fadePct}%, transparent)`
    : undefined;

  const rootStyle = {
    "--marquee-gap": `${gap}px`,
    gap: "var(--marquee-gap)",
    maskImage: mask,
    WebkitMaskImage: mask,
  } as CSSProperties;

  const trackStyle: CSSProperties = {
    gap: "var(--marquee-gap)",
    animationName: duration ? (vertical ? "marquee-y" : "marquee-x") : "none",
    animationDuration: duration ? `${duration}s` : undefined,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: reverse ? "reverse" : "normal",
    animationPlayState: isPaused ? "paused" : "running",
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex overflow-hidden",
        vertical && "flex-col",
        vertical
          ? "motion-reduce:overflow-y-auto"
          : "motion-reduce:overflow-x-auto",
        className,
      )}
      style={rootStyle}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {Array.from({ length: Math.max(2, repeat) }, (_, copy) => (
        <div
          key={copy}
          ref={copy === 0 ? firstCopy : undefined}
          aria-hidden={copy > 0 || undefined}
          inert={copy > 0}
          className={cn(
            "flex shrink-0 justify-around",
            vertical ? "min-h-full flex-col" : "min-w-full",
            "motion-reduce:animate-none",
            copy > 0 && "motion-reduce:hidden",
            trackClassName,
          )}
          style={trackStyle}
        >
          {items.map((item, i) => (
            <div
              key={getKey(item, i)}
              className={cn("shrink-0", itemClassName)}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
