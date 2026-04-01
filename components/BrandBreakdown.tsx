"use client";

import { BrandStat } from "@/lib/data";

export default function BrandBreakdown({ brands }: { brands: BrandStat[] }) {
  const top = brands
    .filter((b) => b.brand && b.brand !== "Unknown")
    .slice(0, 10);

  if (top.length === 0) return null;

  const maxRevenue = top[0].revenue;

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-5">
        <h2 className="font-display font-semibold text-white text-base">Revenue by Brand</h2>
        <p className="text-slate-500 text-xs mt-0.5 font-body">
          Top {top.length} brand{top.length !== 1 ? "s" : ""} by total sales
        </p>
      </div>

      <div className="space-y-2.5">
        {top.map((brand, i) => {
          const pct = (brand.revenue / maxRevenue) * 100;
          // Subtle fade from #1 → #last
          const opacity = Math.max(0.45, 1 - i * 0.055);

          return (
            <div key={brand.brand} className="flex items-center gap-4 group">
              {/* Brand name */}
              <div className="w-32 text-sm font-body font-medium text-slate-400 text-right truncate shrink-0 group-hover:text-slate-300 transition-colors">
                {brand.brand}
              </div>

              {/* Bar track */}
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-6 bg-slate-800/70 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, #059669 0%, #10b981 60%, #34d399 100%)`,
                      opacity,
                    }}
                  />
                </div>

                {/* Dollar amount */}
                <div
                  className="w-16 text-sm font-display font-semibold text-slate-300 text-right shrink-0"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  ${brand.revenue.toFixed(0)}
                </div>

                {/* Item count */}
                <div className="w-14 text-xs text-slate-600 text-right shrink-0 font-body hidden sm:block">
                  {brand.count} item{brand.count !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
