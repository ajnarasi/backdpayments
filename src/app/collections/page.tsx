import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collectionCases, abComparisons } from "@/lib/data";
import { CollectionsList } from "@/components/collections/collections-list";
import { ABComparisonTable } from "@/components/dashboard/ab-comparison";

export default function CollectionsPage() {
  const activeCases = collectionCases.filter((c) => !c.isResolved);
  const resolvedCases = collectionCases.filter((c) => c.isResolved);
  const totalRecovered = collectionCases.reduce((s, c) => s + c.recoveredAmount, 0);
  const totalAmount = collectionCases.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Agentic Collections Engine
        </h1>
        <p className="mt-1 text-sm text-[#9ca3af]">
          AI agent autonomously manages the collections lifecycle — adaptive
          dunning, payment plan negotiation, and intelligent escalation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Active Cases</p>
            <p className="mt-1 text-2xl font-bold text-white">{activeCases.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Resolved</p>
            <p className="mt-1 text-2xl font-bold text-[#ff6b1a]">{resolvedCases.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Total at Risk</p>
            <p className="mt-1 text-2xl font-bold text-white">
              ${(totalAmount / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Recovered</p>
            <p className="mt-1 text-2xl font-bold text-[#ff6b1a]">
              ${(totalRecovered / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Recovery Rate</p>
            <p className="mt-1 text-2xl font-bold text-[#ff6b1a]">
              {totalAmount > 0 ? Math.round((totalRecovered / totalAmount) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Cases List */}
        <div className="lg:col-span-3">
          <Card className="bg-[#161616] border border-[#262626]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                  Collection Cases
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] border-[#3a3a3a] text-[#9ca3af]">
                    {activeCases.length} active
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-[#ff6b1a]/20 bg-[#ff6b1a]/10 text-[#ff6b1a] text-[10px]"
                  >
                    {resolvedCases.length} resolved
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CollectionsList cases={collectionCases} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: A/B Comparison */}
        <div>
          <Card className="bg-[#161616] border border-[#262626]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                Agent vs. Rule-Based
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ABComparisonTable data={abComparisons} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
