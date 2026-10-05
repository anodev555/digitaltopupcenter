"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  LogIn,
  Menu,
  Moon,
  Palette,
  Sun,
  SunMoon,
  X,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

import AppLogo from "@/components/shared/app-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  BRAND,
  BRAND_SHORT,
  helpGroup,
  isActivePath,
  shopGroup,
  type NavItem,
} from "@/lib/nav";
import { cn } from "@/lib/utils";

function NavGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="space-y-1">
      <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {items.map(({ label, href, icon: Icon, badge }) => {
        const isActive = isActivePath(pathname, href);
        return (
          <SheetClose asChild key={href}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2 text-[15px] font-medium smooth",
                isActive
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="flex-1">{label}</span>
              {badge && (
                <Badge className="rounded-full bg-primary/15 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/15">
                  {badge}
                </Badge>
              )}
            </Link>
          </SheetClose>
        );
      })}
    </div>
  );
}

export function MobileMenu({
  activePath = "/",
  className = "btn-primary",
}: {
  activePath?: string;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-[315px] flex-col gap-0 border-r bg-background p-0 [&>button]:hidden"
      >
        <div className="flex h-[50px] items-center justify-between px-4">
          <AppLogo href="/" title={BRAND_SHORT} size="sm" />
          <SheetTitle className="sr-only">Site navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse pages and change your theme
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-6"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Button>
          </SheetClose>
        </div>
        <Separator />

        <div className="flex-1 space-y-5 overflow-y-auto p-3">
          <NavGroup title="Shop" items={shopGroup} pathname={activePath} />
          <NavGroup title="Help" items={helpGroup} pathname={activePath} />
        </div>

        <div className="space-y-2 border-t p-3">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(v) => v && setTheme(v)}
            className="w-full rounded-full border bg-card p-1"
          >
            {[
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "Auto", icon: SunMoon },
              { value: "light", label: "Light", icon: Sun },
            ].map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={label}
                className={cn(
                  "h-9 flex-1 gap-1.5 rounded-full text-[13px] font-medium text-muted-foreground",
                  "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5",
                    value === "system" && "text-orange-500",
                  )}
                  aria-hidden
                />
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="rounded-2xl border bg-card p-3.5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sign in to track orders, earn points and pay from your wallet.
            </p>
            <SheetClose asChild>
              <Button
                asChild
                className="mt-3 w-full shadow-[0_4px_14px_-4px] shadow-primary"
              >
                <Link href="/login">
                  <LogIn />
                  Log in
                </Link>
              </Button>
            </SheetClose>
          </div>

          <p className="px-1 text-xs text-muted-foreground">© 2026 {BRAND}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
