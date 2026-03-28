"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const REPORT_URL = "http://localhost:3000/report/stream-march-24";

export default function HeaderActions() {
  const [toastVisible, setToastVisible] = useState(false);
  const pathname = usePathname();

  function handleShare() {
    const isOnReport = pathname.startsWith("/report/");
    const target = isOnReport ? window.location.href : REPORT_URL;

    navigator.clipboard.writeText(target).then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    });
  }

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400/30 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Report
      </button>

      {/* Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Report link copied!
        </div>
      </div>
    </>
  );
}
