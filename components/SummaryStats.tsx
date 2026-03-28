"use client";

import { AuctionStats } from "@/lib/data";

function Sparkline({ values, color = "#10b981" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const height = 32;
  const width = 100;
  const barW = width / values.length - 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8" preserveAspectRatio="none">
      {values.map((v, i) => {
        const barH = Math.max(2, (v / max) * height);
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={height - barH}
            width={barW}
            height={barH}
            rx={1}
            fill={color}
            opacity={0.6 + 0.4 * (v / max)}
          />
        );
      })}
    </svg>
  );
}

interface Props {
  stats: AuctionStats;
  sparkline: number[];
}

function StatCard({
  label,
  value,
  sub,
  icon,
  sparkline,
  accent = "#10b981",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  sparkline: number[];
  accent?: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
      <div className="p-6 flex items-start gap-4 flex-1">
        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">{icon}</div>
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
      </div>
      <div className="px-2 pb-2">
        <Sparkline values={sparkline} color={accent} />
      </div>
    </div>
  );
}

export default function SummaryStats({ stats, sparkline }: Props) {
  // Derive per-card sparklines from the revenue sparkline
  const itemSparkline = sparkline.map((v) => (v > 0 ? 1 : 0));
  const flatLine = sparkline.map(() => stats.avgSalePrice);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        sub="All completed sales"
        sparkline={sparkline}
        accent="#10b981"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Items Sold"
        value={stats.itemsSold.toString()}
        sub="Verified by vision + audio"
        sparkline={itemSparkline}
        accent="#6366f1"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
      />
      <StatCard
        label="Unique Buyers"
        value={stats.uniqueBuyers.toString()}
        sub="Active in stream"
        sparkline={sparkline.map((v) => (v > 0 ? 1 : 0))}
        accent="#f59e0b"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
      <StatCard
        label="Avg Sale Price"
        value={`$${stats.avgSalePrice.toFixed(2)}`}
        sub="Per item sold"
        sparkline={flatLine}
        accent="#ec4899"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    </div>
  );
}
