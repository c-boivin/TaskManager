"use client";

import { useState } from "react";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";

const initialTasks = [
  {
    id: "1",
    title: "Préparer la présentation",
    description: "Slides et démo pour la réunion client",
    priority: "haute",
    completed: false,
  },
  {
    id: "2",
    title: "Répondre aux e-mails",
    description: "Boîte de réception à traiter",
    priority: "moyenne",
    completed: true,
  },
  {
    id: "3",
    title: "Mettre à jour la documentation",
    description: "README et notes internes",
    priority: "basse",
    completed: false,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);

  function onToggle(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function onDelete(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function onAdd({ title, description, priority }) {
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        description: description ?? "",
        priority,
        completed: false,
      },
      ...prev,
    ]);
  }

  return (
    <div
      id="tasks"
      className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-zinc-950"
    >
      <main className="flex w-full max-w-lg flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          TaskManager
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Gérez vos tâches efficacement
        </p>
        <button
          type="button"
          className="mt-8 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Commencer
        </button>
        <div className="mt-8 w-full text-left">
          <AddTaskForm onAdd={onAdd} />
        </div>
        <div className="mt-8 w-full text-left">
          <TaskList tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
        </div>
      </main>
    </div>
  );
}
