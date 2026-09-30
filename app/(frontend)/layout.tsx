import type { Metadata } from "next";
import NavBar from "@/components/layout/nav-bar";
import { BRAND } from "@/lib/nav";

export const metadata: Metadata = {
  title: `${BRAND} — Top up your games instantly`,
  description: `Top up mobile and PC games at ${BRAND}.`,
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
