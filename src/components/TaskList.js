"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  const list = tasks ?? [];

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1f1f25]">
          <span className="material-symbols-outlined text-[#8d90a0]/30" style={{ fontSize: 32 }}>checklist</span>
        </div>
        <p className="text-sm text-[#8d90a0]">Aucune tâche pour le moment</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col" aria-label="Liste des tâches">
      {list.map((task) => (
        <li key={task.id} className="mb-2">
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
