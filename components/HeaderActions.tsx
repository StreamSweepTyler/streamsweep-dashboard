"use client";

import { useState } from "react";

export default function HeaderActions() {
  const [state, setState] = useState<"idle" | "copied">("idle");

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setState("copied");
      setTimeout(() => setState("idle"), 2200);
    });
  }

  return (
    <>
      <button
        onClick={handleShare}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-medium
          transition-all duration-200 active:scale-95
          border border-emerald-500/25 text-emerald-400
          bg-emerald-500/[0.08] hover:bg-emerald-500/[0.14]
          shadow-[0_0_20px_rgba(16,185,129,0.12)] hover:shadow-[0_0_28px_rgba(16,185,129,0.22)]
        `}
      >
        {state === "copied" ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Report
          </>
        )}
      </button>

      {/* Toast */}
      <div
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none
          transition-all duration-300
          ${state === "copied" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        `}
      >
        <div className="flex items-center gap-2.5 glass rounded-xl px-5 py-3 text-sm font-body text-white shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          Link copied to clipboard
        </div>
      </div>
    </>
  );
}
