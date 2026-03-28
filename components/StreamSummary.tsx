"use client";

import { StreamSummary as StreamSummaryData } from "@/lib/data";

export default function StreamSummary({ summary }: { summary: StreamSummaryData }) {
  const items = [
    {
      label: "Stream Duration",
      value: summary.durationHms,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Most Active Buyer",
      value: `@${summary.mostActiveBuyer}`,
      sub: `${summary.mostActiveBuyerItems} purchases`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: "Top Brand",
      value: summary.topBrand,
      sub: `$${summary.topBrandRevenue} revenue`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      label: "Best Single Sale",
      value: `$${summary.bestSalePrice}`,
      sub: summary.bestSaleItem.slice(0, 32) + (summary.bestSaleItem.length > 32 ? "…" : ""),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-700/60">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-5 flex items-start gap-3">
            <div className="text-emerald-500 mt-0.5 shrink-0">{item.icon}</div>
            <div className="min-w-0">
              <p className="text-slate-500 text-xs font-medium mb-1">{item.label}</p>
              <p className="text-white font-semibold text-sm truncate">{item.value}</p>
              {item.sub && <p className="text-slate-400 text-xs mt-0.5 truncate">{item.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
