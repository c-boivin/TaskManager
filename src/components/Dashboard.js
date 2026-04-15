"use client";

import ProgressBar from "./ProgressBar";
import TaskStats from "./TaskStats";

export default function Dashboard({ tasks }) {
  const list = tasks ?? [];
  const isEmpty = list.length === 0;
  const completedCount = list.filter((task) => task.completed === true).length;
  const progressPercent =
    list.length === 0
      ? 0
      : Math.round((completedCount / list.length) * 100);

  if (isEmpty) return null;

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar percentage={progressPercent} label="Progression globale" />
      <TaskStats tasks={tasks} showProgress={false} />
    </div>
  );
}
