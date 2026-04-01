import type { Metadata } from "next";
import { Instrument_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StreamSweep — Live Auction Analytics",
  description: "AI-powered live stream auction analytics by StreamSweep",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${instrumentSans.variable} ${dmSans.variable}`}>
      <body className="bg-[#020817] text-slate-50 antialiased min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}
