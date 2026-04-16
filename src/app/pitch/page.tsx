"use client";

import {
  Shield,
  Network,
  Bot,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { ScrollDotNav } from "@/components/scroll-dot-nav";

const SECTIONS = [
  { id: "cover", label: "Cover" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "proof", label: "Proof" },
];

const AB_RESULTS = [
  { metric: "Recovery Rate", before: "72%", after: "89%", delta: "+23.6%" },
  { metric: "Days to Resolution", before: "45", after: "28", delta: "-37.8%" },
  { metric: "Cost per Recovery", before: "$142", after: "$67", delta: "-52.8%" },
  { metric: "Customer Retention", before: "61%", after: "84%", delta: "+37.7%" },
];

export default function PitchPage() {
  return (
    <>
      <ScrollDotNav sections={SECTIONS} />

      <div>
        {/* ── SECTION 1: COVER ─────────────────────────── */}
        <section
          id="cover"
          className="deck-section"
          style={{
            background: `
              radial-gradient(circle 900px at 30% 40%, rgba(29,185,84,0.08) 0%, rgba(29,185,84,0.03) 40%, rgba(14,14,14,0) 70%),
              #0e0e0e
            `,
          }}
        >
          <div className="kicker">Backd Payments &middot; Head of Product</div>
          <h1 className="deck-h1">
            The Intelligence<br />
            <span style={{ color: 'var(--accent-green)' }}>Gap.</span>
          </h1>
          <div className="gradient-bar wide" />
          <p className="deck-lead" style={{ marginTop: 16 }}>
            A working prototype for the intelligence layer that turns Backd from a
            lending company into an intelligence platform — predicting defaults
            before they happen and collecting autonomously when they don&apos;t pay.
          </p>
          <p className="deck-body" style={{ marginTop: 16 }}>
            Ajay Narasimmamoorthy &middot; Senior PM &middot; 13 years at Fiserv &amp; Visa<br />
            <span style={{ color: 'var(--text-muted)' }}>Prepared for the CEO and Chief Product Officer</span>
          </p>
          <p style={{ marginTop: 48, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Scroll to begin ↓
          </p>
        </section>

        {/* ── SECTION 2: THE PROBLEM ──────────────────── */}
        <section id="problem" className="deck-section">
          <div className="kicker red">The Problem</div>
          <h2 className="deck-h2">
            B2B Collections<br />Is Broken.
          </h2>
          <div className="gradient-bar" style={{ background: 'var(--accent-red)' }} />
          <p className="deck-lead" style={{ marginTop: 16 }}>
            $3.1 trillion in B2B invoices are overdue in the US alone. 55% of all
            B2B invoices are currently past due. Defaults doubled in 12 months.
          </p>
          <p className="deck-body" style={{ marginTop: 16 }}>
            Collections today is manual, rule-based, and context-blind. The same
            email fires on day 7 regardless of whether the buyer is a loyal
            customer with a cash flow timing issue or a structurally distressed
            business heading for default. <strong style={{ color: 'var(--text-primary)' }}>No one predicts when buyers won&apos;t pay
            — they just react when they don&apos;t.</strong>
          </p>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {[
              { label: "B2B Invoices Overdue", value: "55%", sub: "of all US B2B invoices", color: 'var(--accent-red)' },
              { label: "Merchants Offering Credit", value: "<10%", sub: "but 95% of buyers want it", color: 'var(--accent-amber)' },
              { label: "Weekly Collection Cost", value: "$39K", sub: "per company, 14 hrs/week", color: 'var(--accent-red)' },
              { label: "Defaults Growth", value: "2x", sub: "doubled in 12 months", color: 'var(--accent-red)' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: SOLUTION — THREE MODULES ────── */}
        <section id="solution" className="deck-section">
          <div className="kicker">The Solution</div>
          <h2 className="deck-h2">
            CollectIQ:<br />
            <span style={{ color: 'var(--accent-green)' }}>Three Modules.</span>
          </h2>
          <p className="deck-lead" style={{ marginTop: 16 }}>
            I built CollectIQ to prove this thesis — three intelligence modules
            tested against synthetic data: 200 buyers, 30 sellers, 800+ invoices.
            Explore the live demo in the tabs above.
          </p>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {[
              { icon: Shield, num: "01", title: "Predictive Default Scoring", body: "Multi-signal model flags defaults 30+ days before they happen. Payment velocity, order frequency, dispute patterns — compiled into actionable risk scores.", metric: "30+ days early warning" },
              { icon: Bot, num: "02", title: "Agentic Collections", body: "AI agent selects strategy per case: tone, channel, timing, payment plan structure. Learns which approaches work for which buyer profiles.", metric: "89% recovery rate" },
              { icon: Network, num: "03", title: "Network Credit Intelligence", body: "Buyer paying 3+ Backd sellers on-time = lower risk than individual scoring suggests. A credit signal only Backd possesses.", metric: "$960K incremental volume" },
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.num} className="deck-card green">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(29,185,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color="#1DB954" />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--border-strong)' }}>{mod.num}</span>
                  </div>
                  <div className="deck-card-title green">{mod.title}</div>
                  <div className="deck-card-body">{mod.body}</div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-green)' }}>{mod.metric}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="deck-body" style={{ marginTop: 32 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Navigate the tabs above</strong> to explore each module live:
            Overview, Collections, Risk, Network, and Flywheel.
          </p>
        </section>

        {/* ── SECTION 4: PROOF — A/B RESULTS ─────────── */}
        <section id="proof" className="deck-section">
          <div className="kicker">The Proof</div>
          <h2 className="deck-h2">
            Agent vs.<br />
            <span style={{ color: 'var(--accent-green)' }}>Rule-Based.</span>
          </h2>
          <p className="deck-lead" style={{ marginTop: 16 }}>
            Tested against synthetic data. Three handcrafted showcase cases demonstrate
            the agent&apos;s adaptive reasoning across the full collection lifecycle.
          </p>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {AB_RESULTS.map((r) => (
              <div key={r.metric} className="stat-card" style={{ textAlign: 'center', borderTop: '3px solid var(--accent-green)' }}>
                <div className="stat-label">{r.metric}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
                  <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{r.before}</span>
                  <ArrowRight size={16} color="var(--border-strong)" />
                  <span className="stat-value" style={{ color: 'var(--accent-green)', fontSize: 'clamp(2.5rem,5vw,3.5rem)' }}>{r.after}</span>
                </div>
                <div style={{ marginTop: 12, fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-green)' }}>{r.delta}</div>
              </div>
            ))}
          </div>

          {/* Moat teaser — points to the Flywheel and Roadmap tabs */}
          <div className="grid-3" style={{ marginTop: 48 }}>
            {[
              { title: "Capital Moat", badge: "Fragile", color: 'var(--accent-red)', body: "Credit Key raised $90M. Capital alone is a race to the bottom." },
              { title: "Network Moat", badge: "Compounding", color: 'var(--accent-green)', body: "Cross-seller data creates credit signals only Backd possesses." },
              { title: "Intelligence Moat", badge: "Antifragile", color: 'var(--accent-purple)', body: "Every transaction trains the model. The gap widens daily." },
            ].map((moat) => (
              <div key={moat.title} className="deck-card" style={{ borderLeft: `4px solid ${moat.color}`, padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{moat.title}</span>
                  <span className="kicker" style={{ marginBottom: 0, padding: '2px 8px', fontSize: '0.6rem', color: moat.color, borderColor: moat.color }}>
                    {moat.badge}
                  </span>
                </div>
                <div className="deck-card-body" style={{ fontSize: '0.9rem' }}>{moat.body}</div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 32, fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Explore the <strong style={{ color: 'var(--accent-green)' }}>Flywheel</strong> tab to see how intelligence compounds,
            and the <strong style={{ color: 'var(--accent-green)' }}>Roadmap</strong> tab for the 90-day execution plan.
          </p>
        </section>
      </div>
    </>
  );
}
