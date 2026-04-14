"use client";

import { useId } from "react";

/**
 * @param {{ percentage: number; label: string }} props
 */
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
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
        <span id={labelId}>{label}</span>
        <span className="tabular-nums" aria-hidden>
          {valueNow} %
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={valueNow}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out dark:bg-blue-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
