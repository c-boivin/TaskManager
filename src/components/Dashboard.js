"use client";

import ProgressBar from "./ProgressBar";
import TaskStats from "./TaskStats";

/**
 * @param {{ tasks?: Array<{ completed?: boolean }> }} props
 */
export default function Dashboard({ tasks }) {
  const list = tasks ?? [];
  const isEmpty = list.length === 0;
  const completedCount = list.filter((task) => task.completed === true).length;
  const progressPercent =
    list.length === 0
      ? 0
      : Math.round((completedCount / list.length) * 100);

  return (
    <section
      className="w-full text-left"
      aria-labelledby="dashboard-heading"
    >
      <h3
        id="dashboard-heading"
        className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        Tableau de bord
      </h3>
      {isEmpty ? (
        <p className="mt-4 py-6 text-center text-zinc-700 dark:text-zinc-300">
          Aucune tâche pour le moment. Ajoutez une tâche pour afficher les
          statistiques et la progression.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <ProgressBar percentage={progressPercent} label="Progression" />
          <TaskStats tasks={tasks} showProgress={false} />
        </div>
      )}
    </section>
  );
}
