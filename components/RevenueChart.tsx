"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  timestamp_hms: string;
  timestamp_sec: number;
  sale_price: number;
  item_description: string;
  cumulative_revenue: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-2xl"
      style={{
        background: "rgba(15, 23, 42, 0.92)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        maxWidth: 260,
      }}
    >
      <div className="text-slate-500 text-[10px] tracking-wider uppercase font-display mb-1.5">
        {d.timestamp_hms}
      </div>
      <div className="text-slate-200 font-body text-xs leading-snug mb-2 line-clamp-2">
        {d.item_description}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-emerald-400 font-display font-bold text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
          +${d.sale_price.toFixed(2)}
        </span>
        <span className="text-slate-600 text-xs font-body">
          ${d.cumulative_revenue.toFixed(2)} total
        </span>
      </div>
    </div>
  );
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="glass rounded-xl p-6 h-full min-h-[340px] flex flex-col">
      <div className="mb-5 shrink-0">
        <h2 className="font-display font-semibold text-white text-base">Revenue Over Time</h2>
        <p className="text-slate-500 text-xs mt-0.5 font-body">Cumulative revenue across the stream</p>
      </div>

      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="emeraldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="timestamp_hms"
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "var(--font-body)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "var(--font-body)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={44}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.07)", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="cumulative_revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#emeraldFill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#10b981",
                stroke: "rgba(16, 185, 129, 0.35)",
                strokeWidth: 5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
