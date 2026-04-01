"use client";

import { BuyerStat } from "@/lib/data";

// Deterministic avatar color from username
const AVATAR_PALETTE = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#14b8a6", "#0ea5e9", "#f97316", "#84cc16",
  "#f59e0b", "#ef4444",
];
function avatarColor(username: string): string {
  let h = 0;
  for (const c of username) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

function initials(username: string): string {
  const clean = username.replace(/\d+$/, "");
  const parts = clean.split(/[_\-.\s]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

const MEDAL_COLORS = [
  { number: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", spend: "text-amber-400" },
  { number: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20", spend: "text-slate-300" },
  { number: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", spend: "text-orange-400" },
];

export default function BuyerLeaderboard({ buyers }: { buyers: BuyerStat[] }) {
  const top = buyers.slice(0, 9);

  return (
    <div className="glass rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-6 py-5 border-b border-white/[0.06] shrink-0">
        <h2 className="font-display font-semibold text-white text-base">Top Buyers</h2>
        <p className="text-slate-500 text-xs mt-0.5 font-body">Ranked by total spend</p>
      </div>

      <div className="flex-1 overflow-auto divide-y divide-white/[0.04]">
        {top.map((buyer, i) => {
          const medal = MEDAL_COLORS[i];
          const color = avatarColor(buyer.username);

          return (
            <div
              key={buyer.username}
              className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02] ${
                i === 0 ? "bg-amber-400/[0.03]" : ""
              }`}
            >
              {/* Rank badge */}
              {medal ? (
                <div
                  className={`w-7 h-7 rounded-lg border text-xs font-display font-bold flex items-center justify-center shrink-0 ${medal.bg} ${medal.number}`}
                >
                  {i + 1}
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xs font-display text-slate-600">{i + 1}</span>
                </div>
              )}

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-display font-bold text-white shrink-0"
                style={{ background: color }}
              >
                {initials(buyer.username)}
              </div>

              {/* Name + item count */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-body font-medium text-slate-200 truncate">
                  {buyer.username}
                </div>
                <div className="text-[11px] text-slate-600 font-body">
                  {buyer.itemsBought} item{buyer.itemsBought !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Spend */}
              <div
                className={`text-sm font-display font-semibold shrink-0 ${
                  medal ? medal.spend : "text-slate-400"
                }`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                ${buyer.totalSpent.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
