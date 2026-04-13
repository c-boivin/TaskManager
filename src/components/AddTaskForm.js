"use client";

import { useState } from "react";

const PRIORITIES = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
];

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("moyenne");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd?.({ title: trimmed, description: description.trim(), priority });
    setTitle("");
    setDescription("");
    setPriority("moyenne");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="mb-4 text-center text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Ajouter une nouvelle tâche
      </h2>
      <div className="flex flex-col gap-3">
        <div className="min-w-0 text-left">
          <label
            htmlFor="new-task-title"
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Titre
          </label>
          <input
            id="new-task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nom de la tâche"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>
        <div className="min-w-0 text-left">
          <label
            htmlFor="new-task-description"
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Description
          </label>
          <input
            id="new-task-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails ou contexte (optionnel)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="w-full text-left sm:w-36">
            <label
              htmlFor="new-task-priority"
              className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Priorité
            </label>
            <select
              id="new-task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="h-[42px] w-full shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:ml-auto sm:w-auto"
          >
            Ajouter
          </button>
        </div>
      </div>
    </form>
  );
}
