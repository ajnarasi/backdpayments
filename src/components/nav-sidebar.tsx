"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ShieldAlert,
  Network,
  ShoppingCart,
  Map,
  Brain,
  Presentation,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/pitch", label: "Investor Pitch", icon: Presentation },
  { href: "/", label: "Portfolio Overview", icon: LayoutDashboard },
  { href: "/collections", label: "Collections Engine", icon: Receipt },
  { href: "/risk", label: "Risk Intelligence", icon: ShieldAlert },
  { href: "/network", label: "Network Graph", icon: Network },
  { href: "/intelligence", label: "Intelligence Flywheel", icon: Brain },
  { href: "/checkout", label: "Checkout Demo", icon: ShoppingCart },
  { href: "/strategy", label: "90-Day Roadmap", icon: Map },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0e0e0e] border-r border-[#262626]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1DB954]">
          <span className="text-lg font-black text-white tracking-tighter">B</span>
        </div>
        <div>
          <div className="text-base font-bold leading-none tracking-tight text-white">
            Backd
          </div>
          <div className="text-[11px] font-semibold text-[#1DB954] tracking-wider uppercase mt-0.5">
            CollectIQ
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-0.5 px-3 mt-2">
        <p className="px-3 mb-2 text-[10px] font-semibold text-[#6b7280] uppercase tracking-[0.12em]">
          Platform
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20"
                  : "text-[#9ca3af] hover:bg-[#1c1c1c] hover:text-white border border-transparent"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-[#1DB954]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#262626] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#1DB954] animate-pulse" />
          <span className="text-xs text-[#6b7280]">AI Agent Active</span>
        </div>
        <div className="mt-1 text-[10px] text-[#3a3a3a]">
          Powered by Claude
        </div>
      </div>
    </aside>
  );
}
