import {
  getAuctionData,
  computeStats,
  computeBuyerStats,
  computeBrandStats,
  computeStreamSummary,
  computeSparkline,
} from "@/lib/data";
import ReportView from "@/components/ReportView";

interface Props {
  params: { slug: string };
}

export default function ReportPage({ params }: Props) {
  const rows = getAuctionData();
  const stats = computeStats(rows);
  const buyers = computeBuyerStats(rows);
  const brands = computeBrandStats(rows);
  const summary = computeStreamSummary(rows);
  const sparkline = computeSparkline(rows);

  const sellerName = decodeURIComponent(params.slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <ReportView
      rows={rows}
      stats={stats}
      buyers={buyers}
      brands={brands}
      summary={summary}
      sparkline={sparkline}
      sellerName={sellerName}
      isReport
    />
  );
}
