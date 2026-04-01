"use client";

import { useState, useMemo, useCallback } from "react";
import { AuctionRow } from "@/lib/data";

type SortKey = "timestamp_sec" | "item_description" | "brand" | "size" | "sale_price" | "buyer_username";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "timestamp_sec",    label: "Time" },
  { key: "item_description", label: "Item" },
  { key: "brand",            label: "Brand" },
  { key: "size",             label: "Size" },
  { key: "sale_price",       label: "Price", align: "right" },
  { key: "buyer_username",   label: "Buyer" },
];

export default function AuctionTable({ rows }: { rows: AuctionRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("timestamp_sec");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [brandFilter, setBrandFilter] = useState("");
  const [buyerSearch, setBuyerSearch] = useState("");

  const brands = useMemo(
    () => Array.from(new Set(rows.map((r) => r.brand).filter(Boolean))).sort(),
    [rows]
  );

  const sorted = useMemo(() => {
    const filtered = rows
      .filter((r) => !brandFilter || r.brand === brandFilter)
      .filter((r) => !buyerSearch || r.buyer_username.toLowerCase().includes(buyerSearch.toLowerCase()));

    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, brandFilter, buyerSearch, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const downloadCsv = useCallback(() => {
    const headers: (keyof AuctionRow)[] = [
      "timestamp_hms", "item_description", "brand", "size",
      "sale_price", "buyer_username", "visual_confidence", "audio_confidence",
    ];
    const escape = (v: string | number | undefined) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      headers.join(","),
      ...sorted.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "streamsweep_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted]);

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Table header / controls */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex flex-wrap gap-3 items-center">
        <div className="mr-1">
          <h2 className="font-display font-semibold text-white text-base">Auction Log</h2>
          <p className="text-slate-600 text-xs mt-0.5 font-body">{sorted.length} of {rows.length} sales</p>
        </div>

        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-slate-800/80 border border-white/[0.08] text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500/50 transition-colors font-body"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search buyer…"
          value={buyerSearch}
          onChange={(e) => setBuyerSearch(e.target.value)}
          className="bg-slate-800/80 border border-white/[0.08] text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500/50 transition-colors placeholder-slate-600 min-w-[140px] font-body"
        />

        <button
          onClick={downloadCsv}
          className="ml-auto flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-body font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-slate-950/30 sticky top-0">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`
                    px-4 py-3 cursor-pointer select-none group
                    text-[10px] font-display font-semibold tracking-[0.1em] uppercase
                    text-slate-600 hover:text-slate-300 transition-colors
                    ${col.align === "right" ? "text-right" : "text-left"}
                  `}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <span className={`text-[9px] transition-opacity ${
                      sortKey === col.key ? "opacity-100 text-emerald-500" : "opacity-0 group-hover:opacity-40"
                    }`}>
                      {sortKey === col.key && sortDir === "desc" ? "↓" : "↑"}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={`${row.timestamp_sec}-${i}`}
                className={`
                  border-b border-white/[0.03] transition-colors hover:bg-white/[0.025]
                  ${i % 2 === 1 ? "bg-white/[0.012]" : ""}
                `}
              >
                {/* Time */}
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {row.timestamp_hms}
                </td>

                {/* Item */}
                <td className="px-4 py-3 text-slate-200 font-body text-xs" style={{ minWidth: 200, maxWidth: 340 }}>
                  <span className="line-clamp-2 leading-snug">{row.item_description}</span>
                </td>

                {/* Brand */}
                <td className="px-4 py-3 text-slate-400 font-body text-xs whitespace-nowrap">
                  {row.brand || <span className="text-slate-700">—</span>}
                </td>

                {/* Size */}
                <td className="px-4 py-3 text-slate-400 font-body text-xs whitespace-nowrap">
                  {row.size || <span className="text-slate-700">—</span>}
                </td>

                {/* Price */}
                <td
                  className="px-4 py-3 text-right font-display font-semibold text-emerald-400 whitespace-nowrap text-sm"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  ${row.sale_price.toFixed(2)}
                </td>

                {/* Buyer */}
                <td className="px-4 py-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                  {row.buyer_username}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
