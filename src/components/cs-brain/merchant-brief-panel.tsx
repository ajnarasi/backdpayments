"use client";

import { useEffect, useState } from "react";
import type { MerchantBrief } from "@/types/cs-brain";

interface MerchantBriefPanelProps {
  merchantId: string;
  merchantName: string;
}

export function MerchantBriefPanel({ merchantId, merchantName }: MerchantBriefPanelProps) {
  const [brief, setBrief] = useState<MerchantBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/cs-brain/merchant-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchantId }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MerchantBrief;
        if (!cancelled) setBrief(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load brief");
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
      <div className="deck-card" style={{ padding: 28 }}>
        <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
          Merchant Second Brain
        </p>
        <div className="space-y-3 animate-pulse" aria-hidden>
          <div className="h-4 bg-[#262626] rounded w-3/4" />
          <div className="h-4 bg-[#262626] rounded w-full" />
          <div className="h-4 bg-[#262626] rounded w-5/6" />
        </div>
        <p className="text-xs text-[#6b7280] mt-4">
          Composing brief for <span data-merchant-name>{merchantName}</span>…
        </p>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div className="deck-card" style={{ padding: 28 }}>
        <p className="text-sm text-[#ef4444]">Brief unavailable — {error ?? "unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="deck-card green" style={{ padding: 28 }}>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff6b1a]/20 bg-[#ff6b1a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a]">
          Merchant Second Brain
        </span>
        <span
          className="text-[9px] font-semibold uppercase tracking-wider"
          style={{ color: brief.isLive ? "#10b981" : "#9ca3af" }}
        >
          {brief.isLive ? "• Live Claude Brief" : "• Demo Brief"}
        </span>
      </div>

      {/* TLDR */}
      <p className="text-base leading-relaxed text-white font-medium mb-5">
        {brief.tldr}
      </p>

      {/* Grid: JTBD + Language + Contradictions */}
      <div className="space-y-5">
        <section>
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
            Jobs to Be Done
          </p>
          <ul className="space-y-1.5">
            {brief.jobsToBeDone.map((j, i) => (
              <li key={i} className="text-sm text-[#d1d5db] leading-relaxed">
                <span className="text-[#ff6b1a] mr-2">—</span>
                {j}
              </li>
            ))}
          </ul>
        </section>

        {brief.languageThatLands.length > 0 && (
          <section>
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
              Language That Lands
            </p>
            <div className="space-y-3">
              {brief.languageThatLands.map((l, i) => (
                <div key={i} className="border-l-2 border-[#ff6b1a]/40 pl-3 py-0.5">
                  <p className="text-sm text-white font-medium leading-snug mb-1">
                    &ldquo;{l.framing}&rdquo;
                  </p>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    <span className="font-semibold text-[#d1d5db]">Why:</span> {l.why}
                  </p>
                  <p className="text-xs text-[#6b7280] leading-relaxed mt-0.5">
                    <span className="font-semibold">Evidence:</span> {l.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {brief.contradictions.length > 0 && (
          <section>
            <p className="text-[10px] font-semibold text-[#f59e0b] uppercase tracking-wider mb-2">
              Contradictions — Dig Here
            </p>
            <ul className="space-y-1.5">
              {brief.contradictions.map((c, i) => (
                <li key={i} className="text-sm text-[#fcd34d] leading-relaxed">
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-5 pt-5 border-t border-[#262626]">
          <p className="text-[10px] font-semibold text-[#10b981] uppercase tracking-wider mb-2">
            Next Best Action
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-[#3a3a3a] text-xs font-semibold text-white uppercase tracking-wide">
              {brief.nextBestAction.channel}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-[#3a3a3a] text-xs text-[#d1d5db]">
              tone: {brief.nextBestAction.tone}
            </span>
            {brief.nextBestAction.playbookId && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b1a]/10 border border-[#ff6b1a]/30 text-xs text-[#ff6b1a] font-semibold">
                {brief.nextBestAction.playbookId}
              </span>
            )}
            <span className="ml-auto text-xs text-[#6b7280]">
              ⏱ {brief.nextBestAction.suggestedTiming}
            </span>
          </div>
          <div
            className="p-4 rounded-lg bg-[#0e0e0e] border border-[#262626] text-sm text-[#d1d5db] leading-relaxed italic"
            style={{ fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace", fontSize: "13px" }}
          >
            {brief.nextBestAction.script}
          </div>
        </section>
      </div>
    </div>
  );
}
