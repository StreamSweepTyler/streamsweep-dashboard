// lib/server-data.ts — server-only. Never import this from a client component.
// Used by app/api/auction-data/route.ts only.

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { AuctionRow } from "./data";

let _cache: AuctionRow[] | null = null;

export function getAuctionData(): AuctionRow[] {
  if (_cache) return _cache;
  const csvPath = path.join(process.cwd(), "public", "data", "auction_events_enriched.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");
  const result = Papa.parse<Record<string, string>>(raw, {
    header: true,
    skipEmptyLines: true,
  });
  _cache = result.data.map((row) => ({
    timestamp_sec: parseFloat(row.timestamp_sec) || 0,
    timestamp_hms: row.timestamp_hms || "",
    item_description: row.item_description || "",
    brand: row.brand || "",
    size: row.size || "",
    condition: row.condition || "",
    retail_price_comp: row.retail_price_comp || "",
    sale_price: parseFloat(row.sale_price) || 0,
    buyer_username: row.buyer_username || "",
    visual_confidence: row.visual_confidence || "",
    audio_confidence: row.audio_confidence || "",
    transcript_excerpt: row.transcript_excerpt || "",
  }));
  return _cache;
}
