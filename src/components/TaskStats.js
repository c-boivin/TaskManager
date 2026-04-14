"use client";

import ProgressBar from "./ProgressBar";

/**
 * Affiche des statistiques sur un tableau de tâches ({ id, title, …, completed }).
 * @param {{ tasks?: Array<{ completed?: boolean }>; showProgress?: boolean }} props
 */
export default function TaskStats({ tasks, showProgress = true }) {
  const list = tasks ?? [];
  const total = list.length;
  const completedCount = list.filter((task) => task.completed === true).length;
  const activeCount = total - completedCount;
  const progressPercent =
    total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <section
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
      aria-labelledby="task-stats-heading"
    >
      <h3
        id="task-stats-heading"
        className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50"
      >
        Statistiques
      </h3>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Total
          </dt>
          <dd className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {total}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Complétées
          </dt>
          <dd className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {completedCount}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Actives
          </dt>
          <dd className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {activeCount}
          </dd>
        </div>
      </dl>
      {showProgress ? (
        <div className="mt-4">
          <ProgressBar percentage={progressPercent} label="Progression" />
        </div>
      ) : null}
    </section>
  );
}
