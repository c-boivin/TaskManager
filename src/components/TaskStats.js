"use client";

import ProgressBar from "./ProgressBar";

export default function TaskStats({ tasks, showProgress = true }) {
  const list = tasks ?? [];
  const total = list.length;
  const completedCount = list.filter((task) => task.completed === true).length;
  const activeCount = total - completedCount;
  const progressPercent =
    total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const stats = [
    { label: "Total", value: total },
    { label: "Complétées", value: completedCount },
    { label: "Actives", value: activeCount },
  ];

  return (
    <section aria-labelledby="task-stats-heading">
      <h3 id="task-stats-heading" className="sr-only">
        Statistiques
      </h3>
      <dl className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/[0.08] bg-[#1f1f25] px-3 py-2 sm:px-4 sm:py-3">
            <dt className="text-[10px] font-medium uppercase tracking-wider text-[#8d90a0]">
              {s.label}
            </dt>
            <dd className="mt-1 text-xl font-black tabular-nums text-[#e4e1e9]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      {showProgress && (
        <div className="mt-3">
          <ProgressBar percentage={progressPercent} label="Progression" />
        </div>
      )}
    </section>
  );
}
