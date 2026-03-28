import {
  getAuctionData,
  computeStats,
  computeBuyerStats,
  computeBrandStats,
  computeStreamSummary,
  computeSparkline,
} from "@/lib/data";
import ReportView from "@/components/ReportView";

export default function Home() {
  const rows = getAuctionData();
  const stats = computeStats(rows);
  const buyers = computeBuyerStats(rows);
  const brands = computeBrandStats(rows);
  const summary = computeStreamSummary(rows);
  const sparkline = computeSparkline(rows);

  return (
    <ReportView
      rows={rows}
      stats={stats}
      buyers={buyers}
      brands={brands}
      summary={summary}
      sparkline={sparkline}
    />
  );
}
