import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamSweep — Live Auction Analytics",
  description: "AI-powered live stream auction analytics by StreamSweep",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
