"use client";

import { useEffect, useState } from "react";
import { AuctionStats } from "@/lib/data";

function useCountUp(target: number, duration = 1300, delay = 0): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        setValue(target * eased);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return value;
}

interface CardProps {
  label: string;
  rawValue: number;
  format: (v: number) => string;
  animDelay: number;
  highlight?: boolean;
  icon: React.ReactNode;
}

function StatCard({ label, rawValue, format, animDelay, highlight, icon }: CardProps) {
  const animated = useCountUp(rawValue, 1300, animDelay);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-6
        transition-transform duration-200 hover:scale-[1.015] hover:-translate-y-0.5
        group cursor-default
        ${highlight ? "glass" : "glass"}
      `}
    >
      {/* Subtle tint for revenue card */}
      {highlight && (
        <div className="absolute inset-0 bg-emerald-500/[0.04] pointer-events-none rounded-xl" />
      )}

      {/* Label row */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] font-display font-semibold tracking-[0.18em] text-slate-500 uppercase">
          {label}
        </span>
        <span
          className={`transition-colors duration-200 ${
            highlight
              ? "text-emerald-600 group-hover:text-emerald-500"
              : "text-slate-700 group-hover:text-slate-500"
          }`}
        >
          {icon}
        </span>
      </div>

      {/* Big number */}
      <div
        className={`font-display font-bold leading-none select-none
          ${highlight ? "text-emerald-400 text-5xl sm:text-[3.25rem]" : "text-white text-5xl sm:text-[3.25rem]"}
        `}
        style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}
      >
        {format(animated)}
      </div>
    </div>
  );
}

export default function SummaryStats({ stats }: { stats: AuctionStats; sparkline: number[] }) {
  const cards: CardProps[] = [
    {
      label: "Total Revenue",
      rawValue: stats.totalRevenue,
      format: (v) => `$${v.toFixed(2)}`,
      animDelay: 200,
      highlight: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Items Sold",
      rawValue: stats.itemsSold,
      format: (v) => Math.round(v).toString(),
      animDelay: 300,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Unique Buyers",
      rawValue: stats.uniqueBuyers,
      format: (v) => Math.round(v).toString(),
      animDelay: 400,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Avg Sale Price",
      rawValue: stats.avgSalePrice,
      format: (v) => `$${v.toFixed(2)}`,
      animDelay: 500,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
