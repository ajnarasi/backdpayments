"use client";

import Link from "next/link";
import { ScrollDotNav } from "@/components/scroll-dot-nav";

const SECTIONS = [
  { id: "cover", label: "Cover" },
  { id: "signal", label: "Why alongside CollectIQ" },
  { id: "problem", label: "Problem" },
  { id: "user", label: "Who it's for" },
  { id: "build", label: "How — Karpathy loop" },
  { id: "tradeoffs", label: "Trade-offs" },
  { id: "pnl", label: "P&L impact" },
  { id: "close", label: "Close" },
];

// ── P&L math (visible on page for auditability) ───────────────────────────
const COMPASS_YR1 = {
  expansionDirectRev: 50_000,
  expansionVolume: 1_800_000,
  retentionRev: 120_000,
  retentionVolume: 4_320_000,
  csLeverage: 700_000,
  rampSaving: 240_000, // 3 hires x $80K ramp saving
};
const COMPASS_YR1_TOTAL =
  COMPASS_YR1.expansionDirectRev +
  COMPASS_YR1.retentionRev +
  COMPASS_YR1.csLeverage +
  COMPASS_YR1.rampSaving;
const COMPASS_YR1_VOLUME = COMPASS_YR1.expansionVolume + COMPASS_YR1.retentionVolume;

const COLLECTIQ_YR1 = {
  recoveryUplift: 612_000,
  costPerRecovery: 36_000,
  defaultReduction: 1_200_000,
};
const COLLECTIQ_YR1_TOTAL =
  COLLECTIQ_YR1.recoveryUplift + COLLECTIQ_YR1.costPerRecovery + COLLECTIQ_YR1.defaultReduction;

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function CompassThesisPage() {
  return (
    <>
      <ScrollDotNav sections={SECTIONS} />

      {/* ── COVER ─────────────────────────────────────── */}
      <section
        id="cover"
        className="deck-section"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, rgba(255,107,26,0.22) 0%, rgba(255,107,26,0.06) 35%, rgba(14,14,14,0) 65%), #0e0e0e`,
        }}
      >
        <div className="kicker">Merchant Compass · Thesis</div>
        <h1 className="deck-h1">
          Why build <span style={{ color: "var(--accent-green)" }}>Compass</span>
          <br />
          next to CollectIQ?
        </h1>
        <div className="gradient-bar wide" />
        <p className="deck-lead" style={{ marginTop: 16 }}>
          CollectIQ protects the bottom line. Merchant Compass grows the top line. Same data layer,
          same Claude agent, same Karpathy loop — one intelligence platform with two mouths.
        </p>
        <p className="deck-body" style={{ marginTop: 24 }}>
          This page is the operator&apos;s brief: what it is, who it&apos;s for, how it runs, what
          it trades off, and what it earns.
        </p>
        <p
          style={{
            marginTop: 48,
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Scroll to begin ↓
        </p>
      </section>

      {/* ── 1. SIGNAL (Why alongside CollectIQ) ──────── */}
      <section id="signal" className="deck-section">
        <div className="kicker">1 · Ingest · The Signal</div>
        <h2 className="deck-h2">Two halves of one intelligence layer.</h2>
        <div className="gradient-bar" />
        <p className="deck-lead" style={{ marginTop: 16 }}>
          CollectIQ is the <strong style={{ color: "var(--text-primary)" }}>antibody</strong> — it
          activates when a payment goes wrong. Compass is the{" "}
          <strong style={{ color: "var(--accent-green)" }}>immune memory</strong> — it keeps the
          relationship healthy so payments don&apos;t go wrong in the first place. You don&apos;t
          pick one. An immune system runs both.
        </p>

        <div className="grid-2" style={{ marginTop: 48 }}>
          <div className="deck-card red">
            <div className="deck-card-title red">CollectIQ — Bottom line</div>
            <p className="deck-card-body">
              Internal collections ops. Triggered by overdue invoices, predicted defaults, disputes.
              Agent runs dunning sequences, payment plans, escalation. Measured in recovery rate,
              default rate, cost-per-recovery.
            </p>
            <ul
              style={{ marginTop: 16, fontSize: "0.9rem", color: "var(--text-secondary)", paddingLeft: 18 }}
            >
              <li>72% → 89% recovery rate</li>
              <li>$142 → $67 cost per recovery</li>
              <li>3.2% → 2.1% default rate</li>
            </ul>
          </div>
          <div className="deck-card green">
            <div className="deck-card-title green">Merchant Compass — Top line</div>
            <p className="deck-card-body">
              CS operating layer. Triggered by onboarding events, health scores, expansion signals,
              support tickets. Agent surfaces next-best-action, composes QBRs, ramps new CSMs.
              Measured in retention, expansion ARR, CSM leverage.
            </p>
            <ul
              style={{ marginTop: 16, fontSize: "0.9rem", color: "var(--text-secondary)", paddingLeft: 18 }}
            >
              <li>Retention +15 pts</li>
              <li>Network-validated expansion signal</li>
              <li>CSM ramp 90d → 10d</li>
            </ul>
          </div>
        </div>

        <p className="deck-body" style={{ marginTop: 40 }}>
          Both products read the same payments graph, the same buyer profiles, the same Claude
          agent endpoint. Compass is not a second product — it&apos;s the other face of the same
          intelligence layer, looking at the same merchants with a different question.
        </p>
      </section>

      {/* ── 2. PROBLEM ────────────────────────────────── */}
      <section id="problem" className="deck-section">
        <div className="kicker">2 · Compile · The Problem</div>
        <h2 className="deck-h2">
          CS at Back does not scale
          <br />
          <span style={{ color: "var(--accent-red)" }}>linearly.</span>
        </h2>
        <div className="gradient-bar" />
        <p className="deck-lead" style={{ marginTop: 16 }}>
          450 underwriting applications per day today, growing toward 2,000+. Every new merchant
          adds memory burden. Without Compass, three failure modes are already visible.
        </p>

        <div className="grid-3" style={{ marginTop: 48 }}>
          <div className="deck-card amber">
            <div className="deck-card-title amber">Ramp cost</div>
            <p className="deck-card-body">
              New CSMs take ~90 days to build useful context on a merchant book. Knowledge sits in
              senior heads, Slack threads, and unsearchable call notes. When a senior leaves, the
              book forgets.
            </p>
          </div>
          <div className="deck-card amber">
            <div className="deck-card-title amber">Expansion miss</div>
            <p className="deck-card-body">
              15+ merchants in the current 200-buyer book are network-validated ready for a 25%
              credit-limit increase — $1.8M incremental annual volume. No CSM has time to see it.
              It does not ship until someone compiles it.
            </p>
          </div>
          <div className="deck-card amber">
            <div className="deck-card-title amber">Churn leak</div>
            <p className="deck-card-body">
              At-risk signals hit Collections before CS. By the time CollectIQ sees an overdue
              invoice, the relationship is already gone — the merchant moved their volume
              elsewhere. CS needs to intervene 45-60 days earlier.
            </p>
          </div>
        </div>

        <p className="deck-body" style={{ marginTop: 40 }}>
          Compass compiles every merchant into a{" "}
          <strong style={{ color: "var(--text-primary)" }}>60-second Second Brain</strong>: TLDR,
          jobs-to-be-done, language-that-lands, contradictions, next-best action. New hires read
          them to ramp. Senior hires contribute patterns as playbooks. The agent executes. Every
          outcome compounds.
        </p>
      </section>

      {/* ── 3. USER ──────────────────────────────────── */}
      <section id="user" className="deck-section">
        <div className="kicker">3 · Compile · The User</div>
        <h2 className="deck-h2">
          Head of CS first. CSMs daily.
          <br />
          <span style={{ color: "var(--accent-green)" }}>Merchants benefit.</span>
        </h2>
        <div className="gradient-bar" />

        <div className="grid-3" style={{ marginTop: 48 }}>
          <div className="deck-card">
            <div className="deck-card-title">Primary — Head of Customer Success</div>
            <p className="deck-card-body">
              Measured on CSAT, retention, expansion ARR, CS team throughput. Needs to scale the
              function 2-4x without 2-4x headcount. Needs observability into every merchant
              without opening 200 tabs.
            </p>
            <p
              className="deck-card-body"
              style={{ marginTop: 12, color: "var(--accent-green)", fontStyle: "italic" }}
            >
              &quot;Show me the 10 merchants I need to worry about this week.&quot;
            </p>
          </div>
          <div className="deck-card">
            <div className="deck-card-title">Daily — CSMs</div>
            <p className="deck-card-body">
              Pattern matchers under time pressure. 30-50 merchants per book. Currently open 5 tabs
              per merchant to assemble context. Compass collapses that to one page and one next
              action.
            </p>
            <p
              className="deck-card-body"
              style={{ marginTop: 12, color: "var(--accent-green)", fontStyle: "italic" }}
            >
              &quot;Tell me what this merchant cares about. Draft the email.&quot;
            </p>
          </div>
          <div className="deck-card">
            <div className="deck-card-title">Indirect — Merchants</div>
            <p className="deck-card-body">
              Every merchant gets a CSM who sounds like they already know them on day 1. The CSM
              references the right cash-flow pattern. The QBR is tailored. Expansion offers match
              the merchant&apos;s actual growth story.
            </p>
            <p
              className="deck-card-body"
              style={{ marginTop: 12, color: "var(--accent-green)", fontStyle: "italic" }}
            >
              &quot;Feels like Backd is run by 50 people, not 5.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. BUILD (Karpathy loop) ─────────────────── */}
      <section id="build" className="deck-section">
        <div className="kicker">4 · Act · The Build</div>
        <h2 className="deck-h2">
          Karpathy&apos;s loop, applied
          <br />
          <span style={{ color: "var(--accent-green)" }}>to Customer Success.</span>
        </h2>
        <div className="gradient-bar" />
        <p className="deck-lead" style={{ marginTop: 16 }}>
          The same ingest → compile → act → observe → feedback loop that powers CollectIQ&apos;s
          collections agent powers Compass&apos;s CS agent. Different prompts, same substrate.
        </p>

        <div className="grid-4" style={{ marginTop: 40 }}>
          {[
            {
              step: "Ingest",
              color: "#8b5cf6",
              body: "Tickets, invoices, webhooks, CSM notes, phone transcripts.",
            },
            {
              step: "Compile",
              color: "#3b82f6",
              body: "Each merchant becomes a Second Brain entity page — TLDR + JTBD + language + next action.",
            },
            {
              step: "Act",
              color: "#ff6b1a",
              body: "Agent proposes the next-best-action with channel, tone, script, timing, playbook ID.",
            },
            {
              step: "Observe",
              color: "#f59e0b",
              body: "CSM executes. Outcome — accepted / partial / declined / no-response — logged to the entity.",
            },
            {
              step: "Feedback",
              color: "#10b981",
              body: "Outcomes re-weight prompt variants. Playbook win-rates update. Loop cycles forward.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="deck-card"
              style={{ borderLeft: `3px solid ${s.color}`, padding: 24 }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: s.color,
                  marginBottom: 8,
                }}
              >
                {s.step}
              </p>
              <p className="deck-card-body" style={{ fontSize: "0.95rem" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 className="deck-h3">90-day build plan.</h3>
          <div className="grid-3" style={{ marginTop: 24 }}>
            <div className="deck-card green">
              <div className="deck-card-title green">Days 1-30 · Foundation</div>
              <p className="deck-card-body">
                Ticket + health-score pipeline. Merchant entity pages. Mock-mode brief for offline
                demo. <strong style={{ color: "var(--text-primary)" }}>80% shared with CollectIQ</strong> — types, data layer, agent
                endpoint, design system.
              </p>
            </div>
            <div className="deck-card green">
              <div className="deck-card-title green">Days 31-60 · Action</div>
              <p className="deck-card-body">
                Agent-generated next-best-action wired to real Claude. QBR composer. Outcome
                capture on every intervention. Playbook library seeded with 8-12 plays.
              </p>
            </div>
            <div className="deck-card green">
              <div className="deck-card-title green">Days 61-90 · Flywheel</div>
              <p className="deck-card-body">
                Full Karpathy loop — outcomes re-weight prompts (autoresearch-toolkit harness).
                Playbook win-rates feed back into agent queue. Dashboard metrics per cycle.
              </p>
            </div>
          </div>
        </div>

        <p className="deck-body" style={{ marginTop: 40 }}>
          <Link href="/cs-brain/loop" style={{ color: "var(--accent-green)" }}>
            See the loop running today →
          </Link>
        </p>
      </section>

      {/* ── 5. TRADE-OFFS ────────────────────────────── */}
      <section id="tradeoffs" className="deck-section">
        <div className="kicker">5 · Observe · The Trade-offs</div>
        <h2 className="deck-h2">
          If you had one team,
          <br />
          <span style={{ color: "var(--accent-green)" }}>build the foundation — then ship both.</span>
        </h2>
        <div className="gradient-bar" />
        <p className="deck-lead" style={{ marginTop: 16 }}>
          Honest resource math for 2 engineers + 1 PM + 1 designer, one quarter. Three scenarios.
        </p>

        <div className="grid-3" style={{ marginTop: 40 }}>
          <div className="deck-card red">
            <div className="deck-card-title red">A · CollectIQ only</div>
            <p
              className="deck-card-body"
              style={{ fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}
            >
              90 days
            </p>
            <p className="deck-card-body">
              Recovery 72 → 89%. Default rate 3.2 → 2.1%.{" "}
              <strong style={{ color: "var(--text-primary)" }}>$1.85M/yr bottom-line.</strong>
              Compass stays at zero. Churn leak continues. Expansion ARR left on the table.
            </p>
          </div>
          <div className="deck-card amber">
            <div className="deck-card-title amber">B · Compass only</div>
            <p
              className="deck-card-body"
              style={{ fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}
            >
              90 days
            </p>
            <p className="deck-card-body">
              Retention +15 pts. Expansion +$1.8M volume.{" "}
              <strong style={{ color: "var(--text-primary)" }}>$1.1M/yr top-line.</strong>
              But default rate still 3.2% — losses untouched. You&apos;re growing a leaky book.
            </p>
          </div>
          <div className="deck-card green">
            <div className="deck-card-title green">C · Shared-foundation · RECOMMENDED</div>
            <p
              className="deck-card-body"
              style={{ fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}
            >
              90 days
            </p>
            <p className="deck-card-body">
              CollectIQ Phase 1 (60d) + Compass Phase 1 layered (30d, marginal cost — foundation
              reused).{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                $2.8M+/yr combined. Both flywheels running.
              </strong>{" "}
              ~1.3x the cost of A for ~1.5x the total impact.
            </p>
          </div>
        </div>

        <div
          className="deck-card"
          style={{
            marginTop: 48,
            borderLeft: "3px solid var(--accent-green)",
            padding: 32,
            background: "rgba(16, 185, 129, 0.04)",
          }}
        >
          <p className="deck-card-title green">The real trade-off is sequencing, not selection.</p>
          <p className="deck-card-body" style={{ marginTop: 12 }}>
            CollectIQ&apos;s Phase 1 builds the types, data access, agent endpoints, Claude
            integration, and design system. Compass Phase 1 adds ~5 screens and 3 API routes on top
            of that. Every hour of CollectIQ engineering is also 0.4 hours of Compass engineering.
            Picking CollectIQ-only leaves that marginal 0.4h of work un-captured — a 60% loss of
            intelligence-leverage.
          </p>
          <p className="deck-card-body" style={{ marginTop: 12 }}>
            If cashflow is actively burning — defaults up, collections under-staffed — front-load
            CollectIQ for the first 45 days, then layer Compass. If cashflow is stable but growth
            is stalling, reverse it. In every case,{" "}
            <strong style={{ color: "var(--text-primary)" }}>both ship within 90 days</strong>, not
            sequentially over 180.
          </p>
        </div>
      </section>

      {/* ── 6. P&L IMPACT ────────────────────────────── */}
      <section id="pnl" className="deck-section">
        <div className="kicker">6 · Feedback · The Flywheel</div>
        <h2 className="deck-h2">
          Year-1 P&amp;L impact:
          <br />
          <span style={{ color: "var(--accent-green)" }}>
            {fmtMoney(COMPASS_YR1_TOTAL + COLLECTIQ_YR1_TOTAL)} direct
          </span>
          <span
            style={{
              display: "block",
              fontSize: "0.45em",
              fontWeight: 700,
              color: "var(--text-secondary)",
              marginTop: 12,
              letterSpacing: "0.02em",
              textTransform: "none",
            }}
          >
            plus {fmtMoney(COMPASS_YR1_VOLUME)} incremental annual volume
          </span>
        </h2>
        <div className="gradient-bar" />
        <p className="deck-lead" style={{ marginTop: 16 }}>
          Modeled on the current book — 200 buyers, 30 sellers, ~$7.5M monthly volume. All inputs
          below are visible so the numbers can be audited.
        </p>

        <div style={{ marginTop: 48 }}>
          <h3 className="deck-h3" style={{ color: "var(--accent-green)" }}>
            Compass — additive on top of CollectIQ
          </h3>
          <div className="grid-2" style={{ marginTop: 24 }}>
            <div className="stat-card">
              <p className="stat-label">Expansion — direct revenue</p>
              <p className="stat-value" style={{ color: "var(--accent-green)" }}>
                {fmtMoney(COMPASS_YR1.expansionDirectRev)}
              </p>
              <p className="stat-sub">
                15 network-validated merchants × $120K avg lift = $1.8M volume × 2.8% take rate
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Retention — preserved revenue</p>
              <p className="stat-value" style={{ color: "var(--accent-green)" }}>
                {fmtMoney(COMPASS_YR1.retentionRev)}
              </p>
              <p className="stat-sub">
                Churn -4pts on 200-merchant book = 8 merchants × $540K volume preserved × 2.8% take
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">CS leverage — cost avoidance</p>
              <p className="stat-value" style={{ color: "var(--accent-green)" }}>
                {fmtMoney(COMPASS_YR1.csLeverage)}
              </p>
              <p className="stat-sub">
                Book scales 2.5× without linear hiring — 5 CSM roles avoided at $140K fully-loaded
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Ramp compression</p>
              <p className="stat-value" style={{ color: "var(--accent-green)" }}>
                {fmtMoney(COMPASS_YR1.rampSaving)}
              </p>
              <p className="stat-sub">
                CSM ramp 90d → 10d = 80 days × $1K/day recovered × 3 new hires/yr
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              marginTop: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
            }}
          >
            <strong style={{ color: "var(--accent-green)" }}>Compass Year-1 total direct P&L:</strong>{" "}
            <span style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 700 }}>
              {fmtMoney(COMPASS_YR1_TOTAL)}
            </span>{" "}
            · plus {fmtMoney(COMPASS_YR1_VOLUME)} incremental annual volume feeding take-rate into
            perpetuity.
          </p>
        </div>

        <div style={{ marginTop: 56 }}>
          <h3 className="deck-h3">CollectIQ — baseline (already demonstrated)</h3>
          <div className="grid-3" style={{ marginTop: 24 }}>
            <div className="stat-card">
              <p className="stat-label">Recovery uplift</p>
              <p className="stat-value">{fmtMoney(COLLECTIQ_YR1.recoveryUplift)}</p>
              <p className="stat-sub">72 → 89% on $300K monthly overdue</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Cost per recovery</p>
              <p className="stat-value">{fmtMoney(COLLECTIQ_YR1.costPerRecovery)}</p>
              <p className="stat-sub">$142 → $67 × ~40 recoveries/mo</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Default reduction</p>
              <p className="stat-value">{fmtMoney(COLLECTIQ_YR1.defaultReduction)}</p>
              <p className="stat-sub">3.2% → 2.1% on $7.5M monthly volume</p>
            </div>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              marginTop: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
            }}
          >
            <strong style={{ color: "var(--accent-green)" }}>CollectIQ Year-1 total:</strong>{" "}
            <span style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 700 }}>
              {fmtMoney(COLLECTIQ_YR1_TOTAL)}
            </span>
          </p>
        </div>

        <div
          className="deck-card green"
          style={{ marginTop: 48, padding: 40, background: "rgba(255, 107, 26, 0.08)" }}
        >
          <div className="deck-card-title green">Combined Year-1 direct P&L impact</div>
          <p
            className="big-stat"
            style={{ marginTop: 16, color: "var(--accent-green)", fontSize: "clamp(3.5rem, 9vw, 6rem)" }}
          >
            {fmtMoney(COMPASS_YR1_TOTAL + COLLECTIQ_YR1_TOTAL)}
          </p>
          <p className="deck-card-body" style={{ marginTop: 16 }}>
            + {fmtMoney(COMPASS_YR1_VOLUME)} incremental annual volume which recurs at take-rate
            every year after. And the Karpathy loop means cycle 2 adds{" "}
            <strong style={{ color: "var(--text-primary)" }}>marginal capex ≈ 0</strong> — each
            CSM interaction improves the prompt, each outcome re-weights the agent, each new
            merchant inherits the compiled wisdom.
          </p>
          <p className="deck-card-body" style={{ marginTop: 12, color: "var(--accent-green)" }}>
            Capital does not compound. Intelligence does.
          </p>
        </div>
      </section>

      {/* ── CLOSE ─────────────────────────────────────── */}
      <section id="close" className="deck-section">
        <div className="kicker">Close</div>
        <h2 className="deck-h2">
          One platform.
          <br />
          <span style={{ color: "var(--accent-green)" }}>Two flywheels.</span>
          <br />
          Zero marginal cycles.
        </h2>
        <div className="gradient-bar" />
        <p className="deck-lead" style={{ marginTop: 24 }}>
          CollectIQ already proves the substrate works. Compass is the second head running off the
          same body. Ship together in 90 days, compound forever.
        </p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Link
            href="/cs-brain"
            style={{
              padding: "14px 28px",
              borderRadius: 10,
              background: "var(--accent-green)",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Open Merchant Compass
          </Link>
          <Link
            href="/cs-brain/loop"
            style={{
              padding: "14px 28px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            See the Karpathy loop
          </Link>
          <Link
            href="/cs-brain/merchant/buyer-150"
            style={{
              padding: "14px 28px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Flagship: Midwest Restaurant Group
          </Link>
        </div>
      </section>
    </>
  );
}
