import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { networkNodes, networkEdges, networkInsights } from "@/lib/data";
import { NetworkGraph } from "@/components/network/network-graph";
import { NetworkInsightsList } from "@/components/network/network-insights";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

export default function NetworkPage() {
  const buyerNodes = networkNodes.filter((n) => n.type === "buyer");
  const sellerNodes = networkNodes.filter((n) => n.type === "seller");
  const avgConnections = (
    buyerNodes.reduce((s, n) => s + n.connections, 0) / buyerNodes.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            Network Intelligence
          </h1>
          <Badge
            variant="outline"
            className="border-[#ff6b1a]/20 bg-[#ff6b1a]/10 text-[#ff6b1a]"
          >
            Strategic Vision
          </Badge>
        </div>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Visualize buyer-seller relationships. Leverage network data for better
          credit decisions and growth opportunities.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Network Nodes</p>
            <p className="mt-1 text-2xl font-bold text-white">{networkNodes.length}</p>
            <p className="text-xs text-[#6b7280]">{buyerNodes.length} buyers, {sellerNodes.length} sellers</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Connections</p>
            <p className="mt-1 text-2xl font-bold text-white">{networkEdges.length}</p>
            <p className="text-xs text-[#6b7280]">{avgConnections} avg per buyer</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Expansion Opps</p>
            <p className="mt-1 text-2xl font-bold text-[#ff6b1a]">
              {networkInsights.filter((i) => i.type === "expansion").length}
            </p>
            <p className="text-xs text-[#6b7280]">
              $
              {(
                networkInsights
                  .filter((i) => i.type === "expansion")
                  .reduce((s, i) => s + i.impact, 0) / 1_000_000
              ).toFixed(1)}
              M potential
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Risk Clusters</p>
            <p className="mt-1 text-2xl font-bold text-[#ef4444]">
              {networkInsights.filter((i) => i.type === "risk_cluster").length}
            </p>
            <p className="text-xs text-[#6b7280]">Concentration risk identified</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#161616] border border-[#262626]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Buyer-Seller Network Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkGraph nodes={networkNodes} edges={networkEdges} />
        </CardContent>
      </Card>

      <Card className="bg-[#161616] border border-[#262626]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Network Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkInsightsList insights={networkInsights} />
        </CardContent>
      </Card>
    </div>
  );
}
