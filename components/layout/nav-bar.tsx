"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/layout/mobile-menu";
import AppLogo from "@/components/shared/app-logo";
import { BRAND_SHORT, isActivePath, mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/shared/search-bar";

function Brand() {
  return <AppLogo href="/" size="sm" title={<span>{BRAND_SHORT}</span>} />;
}

const SHINE =
  "linear-gradient(115deg, transparent 0 30%, rgba(255,255,255,.14) 45% 0%, transparent 40% 70%, rgba(255,255,255,.1) 83% 0%, transparent 80%)";

export default function NavBar() {
  const pathname = usePathname();
  const isActive = (href: string) => isActivePath(pathname, href);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1"
        style={{ backgroundImage: SHINE }}
      />

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
          {mainNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-muted-foreground smooth hover:bg-muted hover:text-foreground",
                isActive(href) && "bg-primary/30 text-white",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Suspense
            fallback={
              <div className="hidden max-w-xs flex-1 md:block" aria-hidden />
            }
          >
            <SearchBar
              variant="dialog"
              trigger="icon"
              basePath="/shop"
              placeholder="Search games..."
              className="hidden max-w-xs flex-1 md:block"
            />
          </Suspense>

          <Button asChild className="hidden md:inline-flex btn-primary">
            <Link href="/login">
              <LogIn />
              Login
            </Link>
          </Button>

          <MobileMenu activePath={pathname} />
        </div>
      </div>
    </header>
  );
}
