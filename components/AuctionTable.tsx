"use client";

import { useState, useMemo, useCallback } from "react";
import { AuctionRow } from "@/lib/data";

type SortKey = keyof AuctionRow;
type SortDir = "asc" | "desc";

const CONFIDENCE_DOT: Record<string, { bg: string; title: string }> = {
  high: { bg: "bg-emerald-500", title: "High confidence" },
  medium: { bg: "bg-yellow-400", title: "Medium confidence" },
  low: { bg: "bg-red-500", title: "Low confidence" },
};

function parseRetailPrice(s: string): number {
  const m = s.match(/\$?([\d,]+)/);
  return m ? parseFloat(m[1].replace(/,/g, "")) : 0;
}

function findBestValueIndex(rows: AuctionRow[]): number {
  let best = -1;
  let bestSpread = -1;
  rows.forEach((r, i) => {
    const retail = parseRetailPrice(r.retail_price_comp);
    if (retail > 0 && r.sale_price > 0) {
      const spread = retail - r.sale_price;
      if (spread > bestSpread) { bestSpread = spread; best = i; }
    }
  });
  return best;
}

export default function AuctionTable({ rows }: { rows: AuctionRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("timestamp_sec");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [brandFilter, setBrandFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [buyerSearch, setBuyerSearch] = useState("");

  const brands = useMemo(
    () => ["", ...Array.from(new Set(rows.map((r) => r.brand).filter(Boolean))).sort()],
    [rows]
  );
  const conditions = useMemo(
    () => ["", ...Array.from(new Set(rows.map((r) => r.condition).filter(Boolean))).sort()],
    [rows]
  );

  const filtered = useMemo(() => {
    return rows
      .filter((r) => !brandFilter || r.brand === brandFilter)
      .filter((r) => !conditionFilter || r.condition === conditionFilter)
      .filter((r) => !buyerSearch || r.buyer_username.toLowerCase().includes(buyerSearch.toLowerCase()));
  }, [rows, brandFilter, conditionFilter, buyerSearch]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const bestValueIdx = useMemo(() => findBestValueIndex(sorted), [sorted]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <span className="ml-1 text-slate-600">↕</span>;
    return <span className="ml-1 text-emerald-500">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const downloadCsv = useCallback(() => {
    const headers = ["timestamp_hms", "item_description", "brand", "size", "condition",
      "retail_price_comp", "sale_price", "buyer_username", "visual_confidence", "audio_confidence"];
    const escape = (v: string | number) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      headers.join(","),
      ...sorted.map((r) => headers.map((h) => escape(r[h as keyof AuctionRow])).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "streamsweep_auction_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted]);

  const th = "px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer whitespace-nowrap hover:text-white transition-colors select-none";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex flex-wrap gap-3 items-center">
        <h2 className="text-lg font-semibold text-white mr-2">Auction Log</h2>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none"
        >
          <option value="">All Brands</option>
          {brands.filter(Boolean).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none"
        >
          <option value="">All Conditions</option>
          {conditions.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search buyer..."
          value={buyerSearch}
          onChange={(e) => setBuyerSearch(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-500 min-w-[160px]"
        />
        <span className="text-slate-500 text-sm">{sorted.length} of {rows.length} items</span>
        <button
          onClick={downloadCsv}
          className="ml-auto flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr>
              {[
                ["timestamp_hms", "Time"],
                ["item_description", "Item"],
                ["brand", "Brand"],
                ["size", "Size"],
                ["condition", "Condition"],
                ["retail_price_comp", "Retail Comp"],
                ["sale_price", "Sale $"],
                ["buyer_username", "Buyer"],
                ["visual_confidence", "Conf."],
              ].map(([key, label]) => (
                <th key={key} className={th} onClick={() => handleSort(key as SortKey)}>
                  {label}<SortIcon col={key as SortKey} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {sorted.map((row, i) => {
              const dot = CONFIDENCE_DOT[row.visual_confidence];
              const isBestValue = i === bestValueIdx;
              return (
                <tr key={i} className={`hover:bg-slate-700/30 transition-colors ${isBestValue ? "bg-emerald-900/10" : ""}`}>
                  <td className="px-3 py-3 text-slate-300 font-mono text-xs whitespace-nowrap">
                    {row.timestamp_hms}
                  </td>
                  <td className="px-3 py-3 text-slate-200" style={{ minWidth: "280px", maxWidth: "420px" }}>
                    <div className="flex items-start gap-2">
                      <div className="group relative flex-1 min-w-0">
                        <div className="truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:absolute group-hover:z-20 group-hover:bg-slate-800 group-hover:border group-hover:border-slate-600 group-hover:rounded-lg group-hover:px-3 group-hover:py-2 group-hover:shadow-2xl group-hover:-top-1 group-hover:left-0 group-hover:min-w-[260px] group-hover:max-w-sm text-sm leading-snug">
                          {row.item_description}
                        </div>
                      </div>
                      {isBestValue && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                          ⭐ Best Value
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {row.brand || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {row.size || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {row.condition ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">
                        {row.condition}
                      </span>
                    ) : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-xs">
                    {row.retail_price_comp || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-3 py-3 font-semibold text-emerald-400 whitespace-nowrap">
                    ${row.sale_price}
                  </td>
                  <td className="px-3 py-3 text-slate-300 text-xs whitespace-nowrap">
                    @{row.buyer_username}
                  </td>
                  <td className="px-3 py-3">
                    {dot ? (
                      <span title={dot.title} className="flex items-center gap-1.5">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${dot.bg} ring-2 ring-offset-1 ring-offset-slate-800 ${dot.bg.replace("bg-", "ring-")}/30`} />
                      </span>
                    ) : (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-600" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
