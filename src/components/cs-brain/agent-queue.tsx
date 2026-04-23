import Link from "next/link";
import type { AgentQueueItem } from "@/types/cs-brain";

const PRIORITY_COLOR: Record<AgentQueueItem["priority"], string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#ff6b1a",
  low: "#9ca3af",
};

const CHANNEL_LABEL: Record<AgentQueueItem["suggestedAction"], string> = {
  email: "✉ Email",
  phone: "☎ Phone",
  in_app: "◈ In-app",
  qbr: "★ QBR",
  note: "✎ Note",
};

interface AgentQueueProps {
  items: AgentQueueItem[];
  limit?: number;
}

export function AgentQueue({ items, limit = 10 }: AgentQueueProps) {
  const ordered = [...items].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="deck-card" style={{ padding: 28 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider">
            Agent Queue
          </p>
          <p className="text-lg font-bold text-white mt-0.5">Next-best actions, ranked</p>
        </div>
        <span className="text-xs text-[#6b7280]">{items.length} items</span>
      </div>
      <div className="divide-y divide-[#262626]">
        {ordered.slice(0, limit).map((item) => (
          <Link
            key={item.merchantId + item.title}
            href={`/cs-brain/merchant/${item.merchantId}`}
            className="block py-3 first:pt-0 last:pb-0 no-underline hover:bg-[#1c1c1c]/30 -mx-2 px-2 rounded transition-colors"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ background: PRIORITY_COLOR[item.priority] }}
                aria-label={item.priority}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{item.merchantName}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: PRIORITY_COLOR[item.priority] }}
                  >
                    {item.priority}
                  </span>
                  <span className="text-[9px] text-[#6b7280] uppercase tracking-wider">
                    {item.segment.replace(/_/g, " ")}
                  </span>
                  <span className="text-[9px] text-[#9ca3af] ml-auto">
                    {CHANNEL_LABEL[item.suggestedAction]}
                  </span>
                </div>
                <p className="text-sm text-[#d1d5db] mt-1 leading-snug">{item.title}</p>
                <p className="text-xs text-[#6b7280] mt-1 leading-relaxed line-clamp-2">{item.rationale}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
