"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  const list = tasks ?? [];

  if (list.length === 0) {
    return (
      <p className="py-8 text-center text-zinc-700 dark:text-zinc-300">
        Aucune tâche pour le moment
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4" aria-label="Liste des tâches">
      {list.map((task) => (
        <li key={task.id}>
          <TaskItem
            id={task.id}
            title={task.title}
            description={
              typeof task.description === "string" ? task.description : ""
            }
            priority={task.priority}
            completed={task.completed}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
