import { NextResponse } from "next/server";
import { getAuctionData } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export function GET() {
  const rows = getAuctionData();
  return NextResponse.json(rows);
}
