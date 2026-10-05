import { cn } from "@/lib/utils";

const MASK =
  "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.5) 55%, #000 80%, #000 100%)";

function Overlay({
  mask = MASK,
  className,
}: {
  mask?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full bg-primary transition-opacity",
        className,
      )}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

export default Overlay;
