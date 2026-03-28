"use client";

import Link from "next/link";
import { useState } from "react";

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">StreamSweep</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/upload" className="text-emerald-500 font-medium">Upload</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Upload Stream Recording</h1>
          <p className="text-slate-400 mt-2">Drop your Whatnot stream recording and we{"'"}ll extract every sale automatically.</p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-200 cursor-default ${
            dragging
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-emerald-500/20" : "bg-slate-700"}`}>
              <svg className={`w-8 h-8 transition-colors ${dragging ? "text-emerald-400" : "text-slate-400"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {dragging ? "Drop to upload" : "Drag & drop your stream file"}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                .mov, .mp4, .mkv up to 10GB
              </p>
            </div>
            <div className="flex items-center gap-3 w-full max-w-xs">
              <div className="h-px bg-slate-700 flex-1" />
              <span className="text-slate-500 text-xs">or</span>
              <div className="h-px bg-slate-700 flex-1" />
            </div>
            <button className="bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
              Browse files
            </button>
          </div>
        </div>

        {/* Coming soon banner */}
        <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex items-start gap-4">
          <div className="text-emerald-500 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Processing coming soon</p>
            <p className="text-slate-400 text-sm mt-1">
              Automatic sale extraction from stream recordings is in development.
              Upload your file and we{"'"}ll notify you when it{"'"}s ready —
              or use the CLI pipeline in the meantime.
            </p>
          </div>
        </div>

        {/* Supported formats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Whatnot streams", icon: "📦" },
            { label: "Clothing & apparel", icon: "👕" },
            { label: "Food & grocery", icon: "🛒" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-slate-300 text-xs font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
