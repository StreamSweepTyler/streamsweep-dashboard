// lib/data.ts — types and pure compute functions only.
// No fs/path imports here so this file is safe to import in client components.
// Server-side CSV loading lives in lib/server-data.ts.

export interface AuctionRow {
  timestamp_sec: number;
  timestamp_hms: string;
  item_description: string;
  brand: string;
  size: string;
  condition?: string;         // legacy field, no longer displayed
  retail_price_comp?: string; // legacy field, no longer displayed
  sale_price: number;
  buyer_username: string;
  visual_confidence: string;
  audio_confidence: string;
  transcript_excerpt: string;
}

export interface AuctionStats {
  totalRevenue: number;
  itemsSold: number;
  uniqueBuyers: number;
  avgSalePrice: number;
}

export interface BuyerStat {
  username: string;
  itemsBought: number;
  totalSpent: number;
}

export interface BrandStat {
  brand: string;
  revenue: number;
  count: number;
}

export function computeStats(rows: AuctionRow[]): AuctionStats {
  const totalRevenue = rows.reduce((s, r) => s + r.sale_price, 0);
  const uniqueBuyers = new Set(rows.map((r) => r.buyer_username)).size;
  return {
    totalRevenue,
    itemsSold: rows.length,
    uniqueBuyers,
    avgSalePrice: rows.length > 0 ? totalRevenue / rows.length : 0,
  };
}

export function computeBuyerStats(rows: AuctionRow[]): BuyerStat[] {
  const map = new Map<string, BuyerStat>();
  for (const row of rows) {
    const u = row.buyer_username || "unknown";
    const existing = map.get(u) ?? { username: u, itemsBought: 0, totalSpent: 0 };
    existing.itemsBought++;
    existing.totalSpent += row.sale_price;
    map.set(u, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export function computeBrandStats(rows: AuctionRow[]): BrandStat[] {
  const map = new Map<string, BrandStat>();
  for (const row of rows) {
    const b = row.brand || "Unknown";
    const existing = map.get(b) ?? { brand: b, revenue: 0, count: 0 };
    existing.revenue += row.sale_price;
    existing.count++;
    map.set(b, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export function computeRevenueOverTime(rows: AuctionRow[]) {
  const sorted = [...rows].sort((a, b) => a.timestamp_sec - b.timestamp_sec);
  let cumulative = 0;
  return sorted.map((row) => {
    cumulative += row.sale_price;
    return {
      timestamp_hms: row.timestamp_hms,
      timestamp_sec: row.timestamp_sec,
      sale_price: row.sale_price,
      item_description: row.item_description,
      cumulative_revenue: cumulative,
    };
  });
}

export interface StreamSummary {
  durationHms: string;
  mostActiveBuyer: string;
  mostActiveBuyerItems: number;
  topBrand: string;
  topBrandRevenue: number;
  bestSalePrice: number;
  bestSaleItem: string;
}

export function computeStreamSummary(rows: AuctionRow[]): StreamSummary {
  if (rows.length === 0) {
    return { durationHms: "—", mostActiveBuyer: "—", mostActiveBuyerItems: 0, topBrand: "—", topBrandRevenue: 0, bestSalePrice: 0, bestSaleItem: "—" };
  }

  const sorted = [...rows].sort((a, b) => a.timestamp_sec - b.timestamp_sec);
  const firstSec = sorted[0].timestamp_sec;
  const lastSec = sorted[sorted.length - 1].timestamp_sec;
  const durationSec = lastSec - firstSec;
  const h = Math.floor(durationSec / 3600);
  const m = Math.floor((durationSec % 3600) / 60);
  const s = Math.floor(durationSec % 60);
  const durationHms = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;

  const buyerCounts = new Map<string, number>();
  for (const r of rows) buyerCounts.set(r.buyer_username, (buyerCounts.get(r.buyer_username) ?? 0) + 1);
  const [mostActiveBuyer, mostActiveBuyerItems] = Array.from(buyerCounts.entries()).sort((a, b) => b[1] - a[1])[0] ?? ["—", 0];

  const brandRevenue = new Map<string, number>();
  for (const r of rows) {
    const b = r.brand || "";
    if (b) brandRevenue.set(b, (brandRevenue.get(b) ?? 0) + r.sale_price);
  }
  const [topBrand, topBrandRevenue] = Array.from(brandRevenue.entries()).sort((a, b) => b[1] - a[1])[0] ?? ["—", 0];

  const bestRow = rows.reduce((best, r) => r.sale_price > best.sale_price ? r : best, rows[0]);

  return { durationHms, mostActiveBuyer, mostActiveBuyerItems, topBrand, topBrandRevenue, bestSalePrice: bestRow.sale_price, bestSaleItem: bestRow.item_description };
}

export function computeSparkline(rows: AuctionRow[], buckets = 10): number[] {
  if (rows.length === 0) return Array(buckets).fill(0);
  const sorted = [...rows].sort((a, b) => a.timestamp_sec - b.timestamp_sec);
  const minSec = sorted[0].timestamp_sec;
  const maxSec = sorted[sorted.length - 1].timestamp_sec;
  const bucketSize = Math.max(1, (maxSec - minSec) / buckets);
  const result = Array(buckets).fill(0);
  for (const r of sorted) {
    const idx = Math.min(buckets - 1, Math.floor((r.timestamp_sec - minSec) / bucketSize));
    result[idx] += r.sale_price;
  }
  return result;
}
