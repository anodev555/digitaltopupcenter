import type * as React from "react";
import { Home, Info, Mail, ShoppingBag } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

export const BRAND = "Digital Topup Center";
/** Short form for tight spots, e.g. the logo image's alt text. */
export const BRAND_SHORT = "DTC";

/** Full menu, used by the desktop bar. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "About us", href: "/about", icon: Info },
  { label: "Contact us", href: "/contact", icon: Mail },
];

/** Same links, grouped for the mobile sheet. */
export const shopGroup: NavItem[] = mainNav.filter(
  ({ href }) => href === "/" || href === "/shop",
);

export const helpGroup: NavItem[] = mainNav.filter(
  ({ href }) => href === "/about" || href === "/contact",
);

/**
 * Highlights a link for its exact path and any nested route, so
 * /dashboard/games/1 still marks "Dashboard" active.
 */
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
