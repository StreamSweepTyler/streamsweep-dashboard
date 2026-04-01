"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useReportData } from "@/lib/useReportData";
import ReportView from "@/components/ReportView";

function Spinner() {
  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center">
      <div className="text-center">
        <div className="w-7 h-7 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-sm font-body">Loading report…</p>
      </div>
    </div>
  );
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div
          className="font-display font-bold text-[7rem] leading-none mb-4 select-none"
          style={{ color: "rgba(255,255,255,0.04)" }}
        >
          404
        </div>
        <h1 className="font-display font-semibold text-white text-xl mb-3">
          Report not found
        </h1>
        <p className="text-slate-500 text-sm font-body leading-relaxed mb-8">
          No report exists for <span className="text-slate-400 font-mono text-xs">{slug}</span>.
          It may not have been generated yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-display font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";

  const { rows, stats, buyers, brands, summary, sparkline, meta, loading, notFound, error } =
    useReportData(slug);

  if (loading) return <Spinner />;
  if (notFound || error) return <NotFound slug={slug} />;

  // Format stream_date for display ("2026-03-28" → "March 28, 2026")
  let streamDate: string | undefined;
  if (meta?.stream_date) {
    streamDate = new Date(meta.stream_date + "T12:00:00").toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  }

  return (
    <ReportView
      rows={rows}
      stats={stats}
      buyers={buyers}
      brands={brands}
      summary={summary}
      sparkline={sparkline}
      sellerName={meta?.seller_name}
      streamDate={streamDate}
      isReport
    />
  );
}
