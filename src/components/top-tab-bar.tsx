"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/pitch", label: "Pitch" },
  { href: "/", label: "Overview" },
  { href: "/collections", label: "Collections" },
  { href: "/risk", label: "Risk" },
  { href: "/network", label: "Network" },
  { href: "/cs-brain", label: "Compass" },
  { href: "/cs-brain/why", label: "Thesis" },
  { href: "/intelligence", label: "Flywheel" },
  { href: "/strategy", label: "Roadmap" },
  { href: "/checkout", label: "Checkout" },
];

// Pick the longest href that matches the current pathname so the most
// specific tab wins (e.g. "/cs-brain/why" beats "/cs-brain" on that page).
function activeHref(pathname: string): string {
  let best = "";
  for (const tab of TABS) {
    if (tab.href === "/") continue;
    if (
      pathname === tab.href ||
      pathname.startsWith(tab.href + "/")
    ) {
      if (tab.href.length > best.length) best = tab.href;
    }
  }
  if (best) return best;
  return pathname === "/" ? "/" : "";
}

export function TopTabBar() {
  const pathname = usePathname();
  const current = activeHref(pathname);

  return (
    <nav className="tab-bar" aria-label="Top-level navigation">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 mr-8 shrink-0 no-underline"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff6b1a]">
          <span className="text-sm font-black text-white tracking-tighter">B</span>
        </div>
        <span className="text-xs font-bold text-[#fafafa] tracking-tight hidden md:inline">
          Backd <span className="text-[#ff6b1a]">CollectIQ</span>
        </span>
      </Link>

      {/* Tabs */}
      {TABS.map((tab) => {
        const isActive = tab.href === current;
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
