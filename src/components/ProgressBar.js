"use client";

import { useId } from "react";

export default function ProgressBar({ percentage, label }) {
  const labelId = useId();
  const raw =
    typeof percentage === "number" && Number.isFinite(percentage)
      ? percentage
      : 0;
  const clamped = Math.min(100, Math.max(0, raw));
  const valueNow = Math.round(clamped);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span id={labelId} className="text-xs text-[#8d90a0]">{label}</span>
        <span className="text-xs tabular-nums text-[#b5c4ff]" aria-hidden>
          {valueNow}%
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[#35343a]"
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={valueNow}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#648aff] transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
