"use client";

import { useMemo, useState } from "react";
import AddTaskForm from "../components/AddTaskForm";
import FilterBar, {
  compareTasksByPriorityHighFirst,
  TASK_STATUS,
} from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import TaskList from "../components/TaskList";

const initialTasks = [
  {
    id: "1",
    title: "Préparer la présentation",
    description: "Slides et démo pour la réunion client",
    priority: "haute",
    completed: false,
    createdAt: 1_704_000_000_000,
  },
  {
    id: "2",
    title: "Répondre aux e-mails",
    description: "Boîte de réception à traiter",
    priority: "moyenne",
    completed: true,
    createdAt: 1_706_000_000_000,
  },
  {
    id: "3",
    title: "Mettre à jour la documentation",
    description: "README et notes internes",
    priority: "basse",
    completed: false,
    createdAt: 1_708_000_000_000,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(TASK_STATUS.ALL);
  const [sortOrder, setSortOrder] = useState("priority");

  const { activeCount, totalCount } = useMemo(() => {
    const total = tasks.length;
    const active = tasks.filter((task) => task.completed !== true).length;
    return { activeCount: active, totalCount: total };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tasks
      .filter(
        (task) =>
          q === "" || (task.title ?? "").toLowerCase().includes(q),
      )
      .filter((task) => {
        const done = task.completed === true;
        if (statusFilter === TASK_STATUS.ACTIVE) return !done;
        if (statusFilter === TASK_STATUS.COMPLETED) return done;
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "priority") {
          return compareTasksByPriorityHighFirst(a, b);
        }
        return (a.createdAt ?? 0) - (b.createdAt ?? 0);
      });
  }, [tasks, searchQuery, statusFilter, sortOrder]);

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
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }

  return (
    <div
      id="tasks"
      className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
    >
      <main className="flex w-full max-w-lg flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          TaskManager
        </h1>
        <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
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
        <section
          className="mt-8 flex w-full flex-col gap-4 text-left"
          aria-labelledby="tasks-section-heading"
        >
          <h2
            id="tasks-section-heading"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Vos tâches
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <FilterBar
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
            <p
              className="text-sm text-zinc-700 dark:text-zinc-300"
              aria-live="polite"
            >
              {activeCount === 1
                ? `1 tâche active sur ${totalCount}`
                : `${activeCount} tâches actives sur ${totalCount}`}
            </p>
          </div>
          <div>
            <label
              htmlFor="task-sort-order"
              className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Trier par
            </label>
            <select
              id="task-sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option value="priority">Priorité (hautes → basses)</option>
              <option value="date">Date (plus anciennes d’abord)</option>
            </select>
          </div>
          {tasks.length > 0 && visibleTasks.length === 0 ? (
            <p className="py-8 text-center text-zinc-700 dark:text-zinc-300">
              Aucune tâche ne correspond à ces critères.
            </p>
          ) : (
            <TaskList
              tasks={visibleTasks}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
