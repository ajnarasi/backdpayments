import { collectionCases, buyers, invoices, sellers, networkEdges, networkInsights } from "@/lib/data";
import { notFound } from "next/navigation";
import { CaseDetail } from "@/components/collections/case-detail";

export function generateStaticParams() {
  const buyerIds = new Set(collectionCases.map((c) => c.buyerId));
  return Array.from(buyerIds).map((buyerId) => ({ buyerId }));
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ buyerId: string }>;
}) {
  const { buyerId } = await params;
  const cases = collectionCases.filter((c) => c.buyerId === buyerId);
  if (cases.length === 0) notFound();

  const buyer = buyers.find((b) => b.id === buyerId);
  const buyerInvoices = invoices.filter((i) => i.buyerId === buyerId);

  // Get network edges relevant to this buyer
  const buyerEdges = networkEdges.filter(
    (e) => e.source === buyerId || e.target === buyerId
  );

  // Get network insights that mention this buyer
  const buyerInsights = networkInsights.filter(
    (i) => i.affectedNodes.includes(buyerId)
  );

  // Minimal seller data for network context
  const sellerList = sellers.map((s) => ({ id: s.id, name: s.name }));

  return (
    <CaseDetail
      cases={cases}
      buyer={buyer ?? null}
      invoices={buyerInvoices}
      networkEdges={buyerEdges}
      networkInsights={buyerInsights}
      sellers={sellerList}
    />
  );
}
