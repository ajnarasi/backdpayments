"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import type { NetworkNode, NetworkEdge } from "@/types";

const TIER_COLORS: Record<string, string> = {
  low: "#1DB954",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
};

interface GraphData {
  nodes: { id: string; type: string; name: string; color: string; size: number }[];
  links: { source: string; target: string; value: number }[];
}

export function NetworkGraph({
  nodes,
  edges,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ForceGraph, setForceGraph] = useState<any>(null);

  useEffect(() => {
    import("react-force-graph-2d").then((mod) => {
      setForceGraph(() => mod.default);
    });
  }, []);

  const graphData: GraphData = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      name: n.name,
      color:
        n.type === "seller"
          ? "#fafafa"
          : TIER_COLORS[n.riskTier ?? "low"] ?? "#6B7280",
      size: n.type === "seller" ? 10 : 4 + (n.connections ?? 1) * 1.5,
    })),
    links: edges.map((e) => ({
      source: e.source,
      target: e.target,
      value: e.volume,
    })),
  };

  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D) => {
      const size = node.size ?? 4;

      if (node.type === "seller") {
        // Larger rounded square for sellers — more prominent
        const s = size;
        const r = 3;
        ctx.beginPath();
        ctx.moveTo(node.x - s + r, node.y - s);
        ctx.lineTo(node.x + s - r, node.y - s);
        ctx.quadraticCurveTo(node.x + s, node.y - s, node.x + s, node.y - s + r);
        ctx.lineTo(node.x + s, node.y + s - r);
        ctx.quadraticCurveTo(node.x + s, node.y + s, node.x + s - r, node.y + s);
        ctx.lineTo(node.x - s + r, node.y + s);
        ctx.quadraticCurveTo(node.x - s, node.y + s, node.x - s, node.y + s - r);
        ctx.lineTo(node.x - s, node.y - s + r);
        ctx.quadraticCurveTo(node.x - s, node.y - s, node.x - s + r, node.y - s);
        ctx.closePath();
        ctx.fillStyle = "#1c1c1c";
        ctx.fill();
        ctx.strokeStyle = "#fafafa";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Seller label
        ctx.font = "bold 4px Inter, sans-serif";
        ctx.fillStyle = "#fafafa";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.name.length > 18 ? node.name.slice(0, 16) + "…" : node.name, node.x, node.y + s + 4);
      } else {
        // Glowing circle for buyers
        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI);
        ctx.fillStyle = node.color + "20";
        ctx.fill();

        // Core circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(node.x - size * 0.25, node.y - size * 0.25, size * 0.35, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fill();
      }
    },
    []
  );

  if (!ForceGraph) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Loading network graph...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="h-[500px] overflow-hidden" style={{ borderRadius: 16, border: '1px solid var(--border)', background: '#111111' }}>
        <ForceGraph
          graphData={graphData}
          width={containerRef.current?.offsetWidth ?? 900}
          height={500}
          backgroundColor="#111111"
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
            const size = node.size ?? 4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkColor={() => "rgba(38, 38, 38, 0.8)"}
          linkWidth={(link: any) => Math.max(0.3, Math.min(2, link.value / 200000))}
          d3AlphaDecay={0.04}
          d3VelocityDecay={0.25}
          cooldownTicks={150}
          nodeLabel={(node: any) => `${node.name} (${node.type === 'seller' ? 'Seller' : 'Buyer'})`}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          warmupTicks={50}
        />
      </div>
      {/* Legend */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid #fafafa', background: '#1c1c1c' }} />
          <span>Seller</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#1DB954' }} />
          <span>Low Risk Buyer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
          <span>Medium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F97316' }} />
          <span>High</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}
