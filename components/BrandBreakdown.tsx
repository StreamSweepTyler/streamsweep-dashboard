"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BrandStat } from "@/lib/data";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: BrandStat; value: number }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
      <p className="text-white font-semibold text-sm">{d.brand}</p>
      <p className="text-emerald-400 text-sm mt-1">${d.revenue} revenue</p>
      <p className="text-slate-400 text-xs">{d.count} item{d.count !== 1 ? "s" : ""} sold</p>
    </div>
  );
}

export default function BrandBreakdown({ brands }: { brands: BrandStat[] }) {
  const top = brands.filter((b) => b.brand !== "Unknown" && b.brand !== "").slice(0, 12);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Revenue by Brand</h2>
      <p className="text-slate-400 text-sm mb-6">Top {top.length} brands by total revenue</p>
      <ResponsiveContainer width="100%" height={Math.max(200, top.length * 36)}>
        <BarChart
          layout="vertical"
          data={top}
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <YAxis
            type="category"
            dataKey="brand"
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {top.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? "#10b981" : index === 1 ? "#059669" : index === 2 ? "#047857" : "#1e4d3b"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
