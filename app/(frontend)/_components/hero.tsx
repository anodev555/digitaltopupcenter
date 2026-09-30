import Image from "next/image";
import { cn } from "@/lib/utils";

const SHARP_MASK =
  "linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.6) 64%, transparent 86%)";

const BLUR_MASK =
  "linear-gradient(to bottom, transparent 0%, transparent 38%, #000 66%, transparent 94%)";

export type HeroProps = {
  image?: string;
  preload?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function Hero({
  image = "/images/hero_bg.png",
  preload = true,
  className,
  children,
}: HeroProps) {
  const cover = "object-cover object-[50%_35%]";

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden",
        "h-[clamp(17rem,40vw,36rem)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ maskImage: BLUR_MASK, WebkitMaskImage: BLUR_MASK }}
      >
        <div className="absolute inset-0 scale-110 blur-2xl">
          <Image
            src={image}
            alt="hero background mask"
            fill
            sizes="100vw"
            className={cover}
          />
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ maskImage: SHARP_MASK, WebkitMaskImage: SHARP_MASK }}
      >
        <Image
          src={image}
          alt="hero background image"
          fill
          sizes="100vw"
          preload={preload}
          className={cover}
        />
      </div>

      {children ? (
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="max-w-2xl">{children}</div>
        </div>
      ) : null}
    </section>
  );
}
