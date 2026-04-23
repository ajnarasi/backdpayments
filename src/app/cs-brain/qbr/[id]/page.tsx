import { notFound } from "next/navigation";
import { buyers } from "@/lib/data";
import { SHOWCASE_MERCHANT_IDS } from "@/lib/cs-brain/data";
import { QBRDeckView } from "@/components/cs-brain/qbr-deck";

export function generateStaticParams() {
  const ids = new Set<string>(SHOWCASE_MERCHANT_IDS);
  for (const b of buyers.slice(0, 12)) ids.add(b.id);
  return Array.from(ids).map((id) => ({ id }));
}

export default async function QBRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = buyers.find((b) => b.id === id);
  if (!buyer) notFound();

  return <QBRDeckView merchantId={id} merchantName={buyer.companyName} />;
}
