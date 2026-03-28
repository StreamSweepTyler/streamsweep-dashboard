import Link from "next/link";
import {
  AuctionRow, AuctionStats, BuyerStat, BrandStat,
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
  rows, stats, buyers, brands, summary, sparkline, sellerName, isReport,
}: Props) {
  const revenueData = computeRevenueOverTime(rows);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* StreamSweep logo mark */}
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">StreamSweep</span>
              {isReport && (
                <span className="ml-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Stream Report
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isReport && (
              <nav className="hidden md:flex items-center gap-5 text-sm">
                <Link href="/" className="text-emerald-500 font-medium">Dashboard</Link>
                <Link href="/upload" className="text-slate-400 hover:text-white transition-colors">Upload</Link>
              </nav>
            )}
            {sellerName && (
              <div className="text-right hidden sm:block">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Stream</p>
                <p className="text-white font-semibold text-sm">{sellerName}</p>
              </div>
            )}
            <HeaderActions />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero for report pages */}
        {isReport && (
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-900/30 border border-slate-700 rounded-2xl p-8 overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                  StreamSweep · Auction Analysis
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                Your Stream, Fully Analyzed
                {sellerName && (
                  <span className="block text-xl font-normal text-slate-400 mt-1">{sellerName}</span>
                )}
              </h1>
              <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
                StreamSweep automatically extracted every sale from your live stream recording —
                no manual tracking needed. Here{"'"}s a complete breakdown of your auction performance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-slate-700/60 border border-slate-600/60 rounded-lg px-3 py-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">{stats.itemsSold} items extracted</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/60 border border-slate-600/60 rounded-lg px-3 py-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">${stats.totalRevenue.toLocaleString()} total revenue</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/60 border border-slate-600/60 rounded-lg px-3 py-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-300">{stats.uniqueBuyers} unique buyers</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isReport && (
          <div>
            <h1 className="text-2xl font-bold text-white">Auction Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Whatnot stream analysis · All sales extracted automatically ·{" "}
              <span className="text-slate-500 italic">Note: This was a $3-auction format stream — most items sold for $3</span>
            </p>
          </div>
        )}

        {/* Stats */}
        <SummaryStats stats={stats} sparkline={sparkline} />

        {/* Stream Summary */}
        <StreamSummary summary={summary} />

        {/* Revenue Chart + Buyer Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} />
          </div>
          <div>
            <BuyerLeaderboard buyers={buyers} />
          </div>
        </div>

        {/* Brand Breakdown */}
        <BrandBreakdown brands={brands} />

        {/* Auction Table */}
        <AuctionTable rows={rows} />
      </main>

      {/* Footer */}
      {isReport ? (
        <footer className="mt-20 border-t border-slate-800">
          {/* CTA section */}
          <div className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="max-w-3xl mx-auto text-center">
                {/* Logo */}
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-xl tracking-tight">StreamSweep</span>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed mb-3">
                  This report was generated automatically by{" "}
                  <span className="text-white font-semibold">StreamSweep</span> —{" "}
                  AI-powered analytics for live sellers.
                </p>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  Want a free report for your stream?
                </p>

                <a
                  href="https://streamsweep.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base shadow-lg shadow-emerald-500/20"
                >
                  Request access at streamsweep.ai
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free during beta
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Results in 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-slate-500 text-sm font-medium">StreamSweep</span>
            </div>
            <p className="text-slate-700 text-xs">Powered by StreamSweep · streamsweep.ai</p>
          </div>
        </footer>
      ) : (
        <footer className="border-t border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-slate-500 text-sm text-center">
              Powered by StreamSweep · Auction data extracted automatically from stream recording
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
