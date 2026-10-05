import Image from "next/image";
import Link from "next/link";

export type Offer = {
  id: string;
  title: string; // "5597 Kcoin"
  subtitle: string; // "WeSing Kcoin"
  image: string;
  href: string;
  discount: number;
  tag?: string;
};

const SHINE =
  "linear-gradient(115deg, transparent 0 20%, rgba(255,255,255,.14) 46% 60%, transparent 60% 70%, rgba(255,255,255,.1) 70% 80%, transparent 80%)";

const formatDiscount = (value: number) => `-${value.toFixed(1)}%`;

export default function OfferCard({ offer }: { offer: Offer }) {
  const { title, subtitle, image, href, discount, tag = "Promo" } = offer;

  return (
    <Link
      href={href}
      className="group relative block rounded-xl smooth motion-safe:hover:-translate-y-0.5"
    >
      <div className="absolute left-3 bottom-12 z-10 size-20 shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-sm">
        <Image src={image} alt="" fill sizes="80px" className="object-cover" />
      </div>

      <div className="text-center">
        <div className="relative flex items-center gap-3 overflow-hidden pt-4 pl-26 p-2.5 rounded-xl border-2 border-border text-left bg-card group-hover:bg-primary/60 smooth">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: SHINE }}
          />

          <div className="relative min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">
              {title}
            </p>
            <p className="mt-1 truncate text-xs text-white/75">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center justify-between ml-3 px-3 py-2 text-xs border-2 border-border border-t-0 rounded-b-xl bg-card w-[90%]">
          <span className="rounded bg-lime-400 px-2 py-0.5 font-semibold text-black">
            {tag}
          </span>
          <span className="font-medium tabular-nums text-foreground/80">
            {formatDiscount(discount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
