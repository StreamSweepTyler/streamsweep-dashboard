"use client";

import { BuyerStat } from "@/lib/data";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_STYLES = [
  "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  "bg-slate-400/10 border-slate-400/30 text-slate-300",
  "bg-orange-700/10 border-orange-700/30 text-orange-400",
];

const AVATAR_COLORS = [
  "bg-violet-500/20 border-violet-500/30 text-violet-300",
  "bg-blue-500/20 border-blue-500/30 text-blue-300",
  "bg-pink-500/20 border-pink-500/30 text-pink-300",
  "bg-teal-500/20 border-teal-500/30 text-teal-300",
  "bg-rose-500/20 border-rose-500/30 text-rose-300",
  "bg-indigo-500/20 border-indigo-500/30 text-indigo-300",
];

function getInitials(username: string): string {
  const clean = username.replace(/\d+$/, "");
  const words = clean.split(/[_\-.\s]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

export default function BuyerLeaderboard({ buyers }: { buyers: BuyerStat[] }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Buyer Leaderboard</h2>
        <p className="text-slate-400 text-sm mt-0.5">Ranked by total spend</p>
      </div>
      <div className="divide-y divide-slate-700/50 flex-1 overflow-auto">
        {buyers.map((buyer, i) => (
          <div
            key={buyer.username}
            className={`flex items-center gap-4 px-6 py-4 ${i < 3 ? "bg-slate-700/20" : ""}`}
          >
            {i < 3 ? (
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-base shrink-0 ${RANK_STYLES[i]}`}>
                {MEDALS[i]}
              </div>
            ) : (
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                {getInitials(buyer.username)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${i < 3 ? "text-white" : "text-slate-300"}`}>
                @{buyer.username}
              </p>
              <p className="text-slate-500 text-xs">
                {buyer.itemsBought} item{buyer.itemsBought !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-bold ${
                i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-orange-400" : "text-emerald-400"
              }`}>
                ${buyer.totalSpent}
              </p>
              <p className="text-slate-500 text-xs">spent</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
