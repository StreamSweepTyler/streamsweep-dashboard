"use client";

import { StreamSummary as StreamSummaryData } from "@/lib/data";

export default function StreamSummary({ summary }: { summary: StreamSummaryData }) {
  const items = [
    {
      label: "Stream Duration",
      value: summary.durationHms,
    },
    {
      label: "Most Active Buyer",
      value: summary.mostActiveBuyer,
      sub: `${summary.mostActiveBuyerItems} item${summary.mostActiveBuyerItems !== 1 ? "s" : ""}`,
    },
    {
      label: "Top Brand",
      value: summary.topBrand,
      sub: `$${summary.topBrandRevenue} revenue`,
    },
    {
      label: "Best Single Sale",
      value: `$${summary.bestSalePrice.toFixed(2)}`,
      sub:
        summary.bestSaleItem.length > 30
          ? summary.bestSaleItem.slice(0, 30) + "…"
          : summary.bestSaleItem,
    },
  ];

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.06]">
        {items.map((item) => (
          <div key={item.label} className="px-5 py-4">
            <div className="text-[10px] font-display font-semibold tracking-[0.14em] text-slate-600 uppercase mb-1.5">
              {item.label}
            </div>
            <div className="text-sm font-display font-semibold text-slate-200 truncate">
              {item.value}
            </div>
            {item.sub && (
              <div className="text-[11px] text-slate-600 mt-0.5 truncate font-body">
                {item.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
