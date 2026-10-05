"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMoreBase = {
  label?: string;
  icon?: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
};

type ViewMoreLink = ViewMoreBase & {
  href: string;
  onClick?: never;
};

type ViewMoreButton = ViewMoreBase & {
  onClick: () => void;
  href?: never;
};

export type ViewMore = ViewMoreLink | ViewMoreButton;

export type SectionWidth = "contained" | "full" | "bleed";

const WIDTH: Record<SectionWidth, string> = {
  contained: "mx-auto w-full max-w-7xl px-6",
  full: "w-full px-4 sm:px-8",
  bleed: "w-full",
};

export type SectionProps = {
  title: string;
  description?: string;
  viewMore?: ViewMore;
  action?: ReactNode;
  children: ReactNode;
  width?: SectionWidth;
  headerWidth?: SectionWidth;
  contentWidth?: SectionWidth;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

function ViewMoreAction({ config }: { config: ViewMore }) {
  const {
    label = "View more",
    icon = <ChevronRight className="size-4" />,
    variant = "outline",
    size = "default",
    className,
  } = config;

  const buttonClass = cn("shrink-0 gap-2 sm:px-4", className);

  if (config.href) {
    return (
      <Button asChild variant={variant} size={size} className={buttonClass}>
        <Link href={config.href}>
          {label}
          {icon}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={buttonClass}
      onClick={config.onClick}
    >
      {label}
      {icon}
    </Button>
  );
}

export default function Section({
  title,
  description,
  viewMore,
  action,
  children,
  width = "contained",
  headerWidth,
  contentWidth,
  className,
  headerClassName,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn("w-full py-6", className)}>
      <div
        className={cn(
          WIDTH[headerWidth ?? width],
          "mb-4 flex items-end justify-between gap-4",
          headerClassName,
        )}
      >
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {action ?? (viewMore ? <ViewMoreAction config={viewMore} /> : null)}
      </div>

      <div className={cn(WIDTH[contentWidth ?? width], contentClassName)}>
        {children}
      </div>
    </section>
  );
}
