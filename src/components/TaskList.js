"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  const list = tasks ?? [];

  if (list.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        Aucune tâche pour le moment
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {list.map((task) => (
        <li key={task.id}>
          <TaskItem
            id={task.id}
            title={task.title}
            description={task.description}
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
