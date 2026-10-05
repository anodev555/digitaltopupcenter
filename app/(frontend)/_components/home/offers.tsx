import { cn } from "@/lib/utils";
import Section from "../shared/section";
import OfferCard, { type Offer } from "../shared/cards/offer-card";

export type OfferColumns = {
  base?: 1 | 2;
  md?: 2 | 3;
  lg?: 3 | 4 | 5;
};

export type ExclusiveOffersProps = {
  offers: Offer[];
  title?: string;
  description?: string;
  columns?: OfferColumns;
  className?: string;
};

const COLS = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2" },
  md: { 2: "md:grid-cols-2", 3: "md:grid-cols-3" },
  lg: { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" },
} as const;

export default function ExclusiveOffers({
  offers,
  title = "Exclusive offers",
  description = "Don't miss our limited-time offers! Discover current deals today!",
  columns,
  className,
}: ExclusiveOffersProps) {
  if (offers.length === 0) return null;

  const { base = 2, md = 3, lg = 4 } = columns ?? {};

  return (
    <Section
      title={title}
      description={description}
      viewMore={{
        href: "/packages",
        label: "See all",
        variant: "secondary",
        icon: null,
      }}
      className={className}
      headerClassName="mb-12"
    >
      <ul
        className={cn("grid gap-4", COLS.base[base], COLS.md[md], COLS.lg[lg])}
      >
        {offers.map((offer) => (
          <li key={offer.id}>
            <OfferCard offer={offer} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
