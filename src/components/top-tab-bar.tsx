"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/pitch", label: "Pitch" },
  { href: "/", label: "Overview" },
  { href: "/collections", label: "Collections" },
  { href: "/risk", label: "Risk" },
  { href: "/network", label: "Network" },
  { href: "/intelligence", label: "Flywheel" },
  { href: "/strategy", label: "Roadmap" },
  { href: "/checkout", label: "Checkout" },
];

export function TopTabBar() {
  const pathname = usePathname();

  return (
    <nav className="tab-bar" aria-label="Top-level navigation">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 mr-8 shrink-0 no-underline"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1DB954]">
          <span className="text-sm font-black text-white tracking-tighter">B</span>
        </div>
        <span className="text-xs font-bold text-[#fafafa] tracking-tight hidden md:inline">
          Backd <span className="text-[#1DB954]">CollectIQ</span>
        </span>
      </Link>

      {/* Tabs */}
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-link ${isActive ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
