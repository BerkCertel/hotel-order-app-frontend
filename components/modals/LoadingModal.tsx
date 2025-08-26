"use client";

import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  text?: string;
};

export function LoadingModal({
  open,
  text = "Logging in, please wait...",
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ pointerEvents: "all" }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="flex flex-col items-center gap-6 bg-white rounded-xl shadow-lg px-12 py-10"
        // pointer-events-none ile arka plana tıklamayı engelliyoruz
        style={{ pointerEvents: "auto" }}
      >
        <Loader2
          className="animate-spin text-primary"
          size={48}
          aria-label="Loading spinner"
        />
        <span className="text-lg font-medium text-center">{text}</span>
      </div>
    </div>
  );
}
