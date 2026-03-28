"use client";

import { useParams } from "next/navigation";
import { useAuctionData } from "@/lib/useAuctionData";
import ReportView from "@/components/ReportView";

export default function ReportPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const sellerName = decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const { rows, stats, buyers, brands, summary, sparkline, loading } = useAuctionData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading report…</p>
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
      sellerName={sellerName}
      isReport
    />
  );
}
