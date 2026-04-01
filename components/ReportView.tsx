"use client";

import {
  AuctionRow,
  AuctionStats,
  BuyerStat,
  BrandStat,
  StreamSummary as StreamSummaryType,
  computeRevenueOverTime,
} from "@/lib/data";
import SummaryStats from "./SummaryStats";
import AuctionTable from "./AuctionTable";
import RevenueChart from "./RevenueChart";
import BuyerLeaderboard from "./BuyerLeaderboard";
import BrandBreakdown from "./BrandBreakdown";
import StreamSummary from "./StreamSummary";
import HeaderActions from "./HeaderActions";

interface Props {
  rows: AuctionRow[];
  stats: AuctionStats;
  buyers: BuyerStat[];
  brands: BrandStat[];
  summary: StreamSummaryType;
  sparkline: number[];
  sellerName?: string;
  isReport?: boolean;
}

export default function ReportView({
  rows, stats, buyers, brands, summary, sparkline, sellerName,
}: Props) {
  const revenueData = computeRevenueOverTime(rows);
  const streamDate = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#020817]">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#020817]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <div>
            <div className="font-display font-bold text-lg text-white tracking-tight leading-none">
              StreamSweep
            </div>
            <div className="text-[9px] font-body tracking-[0.2em] text-slate-600 uppercase leading-none mt-1">
              Live Auction Analytics
            </div>
          </div>

          {sellerName && (
            <div className="hidden sm:flex flex-col items-center">
              <span className="font-display font-semibold text-white text-sm">{sellerName}</span>
              <span className="text-[10px] text-slate-600 tracking-wider uppercase">{streamDate}</span>
            </div>
          )}

          <HeaderActions />
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Page title */}
        <div className="anim-fade-in-up" style={{ animationDelay: "0ms" }}>
          {sellerName ? (
            <>
              <h1 className="font-display font-bold text-4xl text-white leading-tight">
                {sellerName}
              </h1>
              <p className="text-slate-500 mt-2 text-sm font-body">
                Stream report &middot; {streamDate} &middot; {rows.length} sales extracted automatically
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-3xl text-white">Auction Dashboard</h1>
              <p className="text-slate-500 mt-2 text-sm font-body">
                {rows.length} sales &middot; extracted automatically from stream recording
              </p>
            </>
          )}
        </div>

        {/* Hero stats */}
        <div className="anim-fade-in-up" style={{ animationDelay: "80ms" }}>
          <SummaryStats stats={stats} sparkline={sparkline} />
        </div>

        {/* Secondary stats bar */}
        <div className="anim-fade-in-up" style={{ animationDelay: "160ms" }}>
          <StreamSummary summary={summary} />
        </div>

        {/* Revenue chart + leaderboard */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-5 anim-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <div className="lg:col-span-3">
            <RevenueChart data={revenueData} />
          </div>
          <div className="lg:col-span-2">
            <BuyerLeaderboard buyers={buyers} />
          </div>
        </div>

        {/* Brand breakdown */}
        <div className="anim-fade-in-up" style={{ animationDelay: "320ms" }}>
          <BrandBreakdown brands={brands} />
        </div>

        {/* Full auction table */}
        <div className="anim-fade-in-up" style={{ animationDelay: "400ms" }}>
          <AuctionTable rows={rows} />
        </div>

        {/* Footer */}
        <footer
          className="border-t border-white/[0.05] pt-8 pb-6 anim-fade-in-up"
          style={{ animationDelay: "480ms" }}
        >
          <p className="text-slate-600 text-sm text-center font-body">
            Powered by{" "}
            <span className="text-slate-500 font-medium">StreamSweep</span>
            {" \u00b7 "}
            <a
              href="https://streamsweep.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-emerald-500 transition-colors duration-150"
            >
              Want analytics for your stream? Visit streamsweep.ai
            </a>
          </p>
        </footer>

      </main>
    </div>
  );
}
