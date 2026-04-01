"use client";

import { useState, useEffect } from "react";
import type { AuctionRow, AuctionStats, BuyerStat, BrandStat, StreamSummary } from "./data";
import {
  computeStats,
  computeBuyerStats,
  computeBrandStats,
  computeStreamSummary,
  computeSparkline,
} from "./data";

export interface ReportMeta {
  seller_name: string;
  stream_date: string;   // "YYYY-MM-DD"
  platform: string;
  category: string;
}

interface ReportJson extends ReportMeta {
  events: AuctionRow[];
}

export interface ReportDataResult {
  rows: AuctionRow[];
  stats: AuctionStats;
  buyers: BuyerStat[];
  brands: BrandStat[];
  summary: StreamSummary;
  sparkline: number[];
  meta: ReportMeta | null;
  loading: boolean;
  notFound: boolean;
  error: string | null;
}

const EMPTY_STATS: AuctionStats = { totalRevenue: 0, itemsSold: 0, uniqueBuyers: 0, avgSalePrice: 0 };
const EMPTY_SUMMARY: StreamSummary = {
  durationHms: "—", mostActiveBuyer: "—", mostActiveBuyerItems: 0,
  topBrand: "—", topBrandRevenue: 0, bestSalePrice: 0, bestSaleItem: "—",
};

export function useReportData(slug: string): ReportDataResult {
  const [rows, setRows]       = useState<AuctionRow[]>([]);
  const [meta, setMeta]       = useState<ReportMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetch(`/reports/${slug}/data.json`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ReportJson>;
      })
      .then((data) => {
        if (!data) return;
        // Coerce numeric fields that may come through as strings from JSON
        const events: AuctionRow[] = (data.events || []).map((e) => ({
          ...e,
          timestamp_sec: Number(e.timestamp_sec) || 0,
          sale_price: Number(e.sale_price) || 0,
        }));
        setRows(events);
        setMeta({
          seller_name: data.seller_name || slug,
          stream_date: data.stream_date || "",
          platform:    data.platform || "",
          category:    data.category || "",
        });
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return {
    rows,
    stats:    rows.length > 0 ? computeStats(rows)          : EMPTY_STATS,
    buyers:   rows.length > 0 ? computeBuyerStats(rows)     : [],
    brands:   rows.length > 0 ? computeBrandStats(rows)     : [],
    summary:  rows.length > 0 ? computeStreamSummary(rows)  : EMPTY_SUMMARY,
    sparkline: rows.length > 0 ? computeSparkline(rows)     : Array(10).fill(0),
    meta,
    loading,
    notFound,
    error,
  };
}
