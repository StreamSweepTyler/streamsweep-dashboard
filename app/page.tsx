"use client";

import { useAuctionData } from "@/lib/useAuctionData";
import ReportView from "@/components/ReportView";

export default function Home() {
  const { rows, stats, buyers, brands, summary, sparkline, loading } = useAuctionData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading auction data…</p>
      </div>
    );
  }

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
