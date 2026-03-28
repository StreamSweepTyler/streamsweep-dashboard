"use client";

import { useState, useEffect } from "react";
import type { AuctionRow } from "./data";
import {
  computeStats,
  computeBuyerStats,
  computeBrandStats,
  computeStreamSummary,
  computeSparkline,
  type AuctionStats,
  type BuyerStat,
  type BrandStat,
  type StreamSummary,
} from "./data";

export interface AuctionDataResult {
  rows: AuctionRow[];
  stats: AuctionStats;
  buyers: BuyerStat[];
  brands: BrandStat[];
  summary: StreamSummary;
  sparkline: number[];
  loading: boolean;
  error: string | null;
}

const emptyStats: AuctionStats = { totalRevenue: 0, itemsSold: 0, uniqueBuyers: 0, avgSalePrice: 0 };
const emptySummary: StreamSummary = {
  durationHms: "—",
  mostActiveBuyer: "—",
  mostActiveBuyerItems: 0,
  topBrand: "—",
  topBrandRevenue: 0,
  bestSalePrice: 0,
  bestSaleItem: "—",
};

export function useAuctionData(): AuctionDataResult {
  const [rows, setRows] = useState<AuctionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auction-data")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<AuctionRow[]>;
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const stats = rows.length > 0 ? computeStats(rows) : emptyStats;
  const buyers = rows.length > 0 ? computeBuyerStats(rows) : [];
  const brands = rows.length > 0 ? computeBrandStats(rows) : [];
  const summary = rows.length > 0 ? computeStreamSummary(rows) : emptySummary;
  const sparkline = rows.length > 0 ? computeSparkline(rows) : Array(10).fill(0);

  return { rows, stats, buyers, brands, summary, sparkline, loading, error };
}
