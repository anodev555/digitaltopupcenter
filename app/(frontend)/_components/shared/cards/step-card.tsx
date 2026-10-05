import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type StepCardProps = {
  step: Step;
  index?: number;
  total?: number;
  className?: string;
};

export default function StepCard({
  step,
  index = 0,
  total = 1,
  className,
}: StepCardProps) {
  const { icon: Icon, title, description } = step;

  const number = index + 1;

  return (
    <article
      className={cn(
        "group smooth motion-safe:hover:-translate-y-0.5 h-full",
        className,
      )}
    >
      <div className="smooth relative flex h-full flex-col overflow-hidden rounded-xl bg-card group-hover:bg-primary/60">
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1 z-1 select-none text-5xl font-black leading-none tabular-nums text-foreground/5"
        >
          {String(number).padStart(2, "0")}
        </span>

        <div className="relative z-2 flex items-start gap-3 p-3 pb-2">
          <div className="smooth relative grid size-11 shrink-0 place-items-center rounded-xl border-2 border-border bg-primary/20 text-primary group-hover:text-white">
            <Icon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold leading-tight">
              {title}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-white/75">
              Step {number} of {total}
            </p>
          </div>
        </div>

        <div className="relative z-2 flex-1 px-3 pb-3">
          <p className="line-clamp-2 text-xs leading-4 font-medium text-foreground/85 group-hover:text-white/90">
            {description}
          </p>
        </div>

        <div className="relative z-2 flex items-center gap-1 border-t-2 border-border px-3 pt-1.5 pb-2 text-xs">
          <span aria-hidden className="flex items-center gap-1">
            {Array.from({ length: Math.max(total, 1) }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full smooth",
                  i < number ? "w-3 bg-lime-400" : "w-1.5 bg-foreground/25",
                )}
              />
            ))}
          </span>
        </div>
      </div>
    </article>
  );
}
