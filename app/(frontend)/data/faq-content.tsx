import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

/**
 * Shared FAQ vocabulary and the tiny presentational helpers used inside FAQ
 * answers.
 *
 * These live outside `faq-section.tsx` on purpose: that module is a Client
 * Component and imports `FAQ_ITEMS` from the data module, so importing `A`/`B`
 * back from it in `data/index.tsx` created a cycle. `FAQ_ITEMS` evaluates `<B>`
 * at module scope, which ran before the client module had finished
 * initialising and threw "Cannot access 'B' before initialization".
 */

export type FaqCategoryId =
  | "ordering"
  | "paying"
  | "delivery"
  | "account"
  | "refunds"
  | "rewards";

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  icon: LucideIcon;
};

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: ReactNode;
  keywords?: string;
};

/** Inline link used inside an FAQ answer. */
export const A = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    className="font-medium text-lime-400 underline-offset-4 hover:underline"
  >
    {children}
  </Link>
);

/** Inline emphasis used inside an FAQ answer. */
export const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);