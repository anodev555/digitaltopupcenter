import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: 24,
  md: 32,
  lg: 44,
  xl: 64,
} as const;

export type AppLogoSize = keyof typeof SIZES;

type AppLogoProps = {
  href?: string;
  title?: React.ReactNode;
  size?: AppLogoSize;
  className?: string;
  /* Omit "title" too: it collides with the anchor's native title attribute */
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "title">;

export function AppLogo({
  href = "/",
  title,
  size = "md",
  className,
  ...linkProps
}: AppLogoProps) {
  const height = SIZES[size];
  const width = Math.round(height * (1941 / 895));

  return (
    <Link
      href={href}
      className={cn("group inline-flex shrink-0 items-center gap-2", className)}
      {...linkProps}
    >
      <Image
        src="/logo.png"
        alt={title ? "" : "Logo"}
        height={height}
        width={width}
        priority
        className="h-auto w-auto object-contain transition-opacity group-hover:opacity-80"
      />
      {title ? (
        <span
          className={cn(
            "font-heading tracking-widest whitespace-nowrap font-semibold",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-xl",
            size === "xl" && "text-2xl",
          )}
        >
          {title}
        </span>
      ) : null}
    </Link>
  );
}

export default AppLogo;
