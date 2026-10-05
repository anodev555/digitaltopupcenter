import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Flame,
  Zap,
  Crosshair,
  Shield,
  Crown,
  Box,
  Music2,
  Goal,
  Swords,
  Target,
  CreditCard,
  Play,
  Sparkles,
  LogIn,
  UserPlus,
  KeyRound,
  ShoppingCart,
  Headset,
  Palette,
  Star,
  Info,
  RotateCcw,
  FileText,
  ShieldCheck,
  MessageCircle,
  Users,
  Camera,
  type LucideIcon,
} from "lucide-react";
import AppLogo from "../shared/app-logo";
import { BRAND } from "@/lib/nav";
import SubscribeBanner from "@/app/(frontend)/_components/shared/subscribe-banner";

export type FooterLink = { label: string; href: string; icon: LucideIcon };

export type FooterGroup = {
  title: string;
  links: FooterLink[];
  columns?: number;
};

export type FooterSocial = { label: string; href: string; icon: LucideIcon };

export type FooterPayment = { name: string; logo: string };

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: "Games",
    columns: 2,
    links: [
      { label: "Free Fire", href: "/shop/free-fire", icon: Flame },
      {
        label: "Free Fire Topup Auto",
        href: "/shop/free-fire-auto",
        icon: Zap,
      },
      { label: "PUBG Mobile", href: "/shop/pubg", icon: Crosshair },
      { label: "Clash of Clans", href: "/shop/clash-of-clans", icon: Shield },
      { label: "Clash Royale", href: "/shop/clash-royale", icon: Crown },
      { label: "Roblox", href: "/shop/roblox", icon: Box },
      { label: "eFootball", href: "/shop/efootball", icon: Goal },
      { label: "Mobile Legends", href: "/shop/mobile-legends", icon: Swords },
      { label: "Blood Strike", href: "/shop/blood-strike", icon: Target },
      { label: "UniPin", href: "/shop/unipin", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login", icon: LogIn },
      { label: "Create account", href: "/register", icon: UserPlus },
      { label: "Forgot password", href: "/forgot-password", icon: KeyRound },
      { label: "Cart", href: "/cart", icon: ShoppingCart },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", href: "/support", icon: Headset },
      { label: "Reviews", href: "/reviews", icon: Star },
      { label: "About Us", href: "/about", icon: Info },
      { label: "Refund Policy", href: "/refund-policy", icon: RotateCcw },
      { label: "Terms of Service", href: "/terms", icon: FileText },
      { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    ],
  },
];

export const FOOTER_SOCIALS: FooterSocial[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/9779800000000",
    icon: MessageCircle,
  },
  { label: "Facebook", href: "https://facebook.com/", icon: Users },
  { label: "Instagram", href: "https://instagram.com/", icon: Camera },
];

export const FOOTER_PAYMENTS: FooterPayment[] = [
  { name: "eSewa", logo: "/images/payments/esewa.png" },
  { name: "Khalti", logo: "/images/payments/khalti.png" },
  { name: "Bank", logo: "/images/payments/bank.png" },
];

export type FooterProps = {
  brandName?: string;
  tagline?: string;
  disclaimer?: string;
  groups?: FooterGroup[];
  socials?: FooterSocial[];
  payments?: FooterPayment[];
  className?: string;
};

function FooterLinkGroup({ title, links, columns = 1 }: FooterGroup) {
  const rows = Math.ceil(links.length / columns);

  return (
    <nav aria-label={title}>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul
        className="grid grid-flow-col gap-x-10 gap-y-1"
        style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
      >
        {links.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex items-center gap-2.5 text-sm text-muted-foreground smooth hover:text-foreground"
            >
              <Icon className="size-3.5 shrink-0" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialLinks({ items }: { items: FooterSocial[] }) {
  return (
    <ul className="flex items-center gap-3">
      {items.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function PaymentBadges({ items }: { items: FooterPayment[] }) {
  return (
    <ul
      className="flex flex-wrap items-center gap-3"
      aria-label="Accepted payments"
    >
      {items.map(({ name, logo }) => (
        <li
          key={name}
          className="grid h-7 w-11.5 place-items-center rounded-md bg-white px-1.5"
        >
          <Image
            src={logo}
            alt={name}
            width={40}
            height={20}
            className="h-4 w-auto object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

export default function Footer({
  brandName = BRAND,
  tagline = "Nepal's trusted game top-up store. Pay with eSewa, Khalti or bank, get it in minutes.",
  disclaimer = "Not affiliated with Garena, Krafton, Supercell, Roblox, Konami, Moonton or NetEase.",
  groups = FOOTER_GROUPS,
  socials = FOOTER_SOCIALS,
  payments = FOOTER_PAYMENTS,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn("w-full border-t border-border bg-background", className)}
    >
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="relative mb-12">
          <SubscribeBanner />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_1.4fr_0.9fr_0.8fr]">
          <div className="space-y-5">
            <AppLogo className="h-8 w-auto" />
            <p className="max-w-xs text-sm text-muted-foreground">{tagline}</p>
            {/* <SocialLinks items={socials} />
            <PaymentBadges items={payments} /> */}
          </div>

          {groups.map((group) => (
            <FooterLinkGroup key={group.title} {...group} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brandName}
          </p>
          <p className="max-w-md leading-relaxed sm:text-right">{disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
