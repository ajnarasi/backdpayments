"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { QBRDeck } from "@/types/cs-brain";

interface QBRDeckViewProps {
  merchantId: string;
  merchantName: string;
}

export function QBRDeckView({ merchantId, merchantName }: QBRDeckViewProps) {
  const [deck, setDeck] = useState<QBRDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/cs-brain/qbr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchantId }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as QBRDeck;
        if (!cancelled) setDeck(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [merchantId]);

  if (loading) {
    return (
      <div className="deck-card green" style={{ padding: 40 }}>
        <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider mb-2">
          Quarterly Business Review · Composing Deck
        </p>
        <h1 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          {merchantName}
        </h1>
        <p className="text-sm text-[#9ca3af] mb-6">
          Synthesizing last 90 days — invoices, tickets, actions, expansion signals…
        </p>
        <div className="space-y-3" aria-hidden>
          <div className="h-3 bg-[#262626] rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-[#262626] rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-[#262626] rounded w-3/4 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return <p className="text-sm text-[#ef4444]">QBR unavailable — {error ?? "unknown error"}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Cover */}
      <div className="deck-card green" style={{ padding: 40 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider mb-2">
              Quarterly Business Review · {deck.quarter}
            </p>
            <h1 className="text-4xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
              {deck.merchantName}
            </h1>
            <p className="mt-2 text-sm text-[#9ca3af]">
              Generated {new Date(deck.generatedAt).toLocaleString()} · Merchant Compass
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-[#ff6b1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff7f33] transition-colors print:hidden"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Sections */}
      {deck.sections.map((s, i) => (
        <section key={s.id} className="deck-card" style={{ padding: 40 }}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider mb-2">
                {s.kicker} · Section {i + 1}
              </p>
              <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.015em" }}>
                {s.title}
              </h2>
              <p className="text-base text-[#d1d5db] leading-relaxed max-w-2xl mb-4">{s.body}</p>
              <ul className="space-y-2">
                {s.bullets.map((b, idx) => (
                  <li key={idx} className="text-sm text-[#9ca3af] leading-relaxed flex gap-2">
                    <span className="text-[#ff6b1a] shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            {s.stat && (
              <div className="stat-card" style={{ minWidth: 180 }}>
                <p className="stat-label">{s.stat.label}</p>
                <p className="stat-value">{s.stat.value}</p>
                {s.stat.delta && <p className="stat-sub">{s.stat.delta}</p>}
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="flex justify-between items-center print:hidden">
        <Link href={`/cs-brain/merchant/${deck.merchantId}`} className="text-xs text-[#ff6b1a] hover:underline">
          ← Back to {deck.merchantName} Second Brain
        </Link>
        <Link href="/cs-brain" className="text-xs text-[#9ca3af] hover:text-[#ff6b1a]">
          Merchant Compass
        </Link>
      </div>
    </div>
  );
}
