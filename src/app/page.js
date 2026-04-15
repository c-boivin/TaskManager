"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import AddTaskForm from "../components/AddTaskForm";
import Dashboard from "../components/Dashboard";
import FilterBar, {
  compareTasksByPriorityHighFirst,
  TASK_STATUS,
} from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import TaskList from "../components/TaskList";
import { AuthContext } from "@/contexts/AuthContext";
import {
  addTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
} from "@/services/taskService";

function createdAtMillis(createdAt) {
  if (createdAt == null) return 0;
  if (typeof createdAt === "number") return createdAt;
  if (typeof createdAt?.toMillis === "function") return createdAt.toMillis();
  if (typeof createdAt?.seconds === "number") {
    return createdAt.seconds * 1000 + Math.floor((createdAt.nanoseconds ?? 0) / 1e6);
  }
  return 0;
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const userId = user?.uid;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(TASK_STATUS.ALL);
  const [sortOrder, setSortOrder] = useState("priority");

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe;
    try {
      unsubscribe = subscribeToTasks(
        userId,
        (nextTasks) => {
          setTasks(nextTasks);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err?.message ?? String(err));
          setLoading(false);
        },
      );
    } catch (e) {
      setError(e?.message ?? String(e));
      setLoading(false);
    }

    return () => {
      unsubscribe?.();
    };
  }, [userId]);

  const { activeCount, totalCount } = useMemo(() => {
    const total = tasks.length;
    const active = tasks.filter((task) => task.completed !== true).length;
    return { activeCount: active, totalCount: total };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (q === "") return true;
        const inTitle = (task.title ?? "").toLowerCase().includes(q);
        const inDescription = (task.description ?? "")
          .toLowerCase()
          .includes(q);
        return inTitle || inDescription;
      })
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
        return createdAtMillis(a.createdAt) - createdAtMillis(b.createdAt);
      });
  }, [tasks, searchQuery, statusFilter, sortOrder]);

  async function onToggle(id) {
    if (!userId) return;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      setError(null);
      await updateTask(userId, id, { completed: !task.completed });
    } catch (e) {
      setError(e?.message ?? String(e));
    }
  }

  async function onDelete(id) {
    if (!userId) return;
    try {
      setError(null);
      await deleteTask(userId, id);
    } catch (e) {
      setError(e?.message ?? String(e));
    }
  }

  async function onAddTask({ title, priority, description }) {
    if (!userId) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    await addTask(userId, { title, priority, description });
  }

  return (
    <AuthGuard>
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
            <AddTaskForm onAddTask={onAddTask} />
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
            {error ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            {loading ? (
              <p
                className="py-8 text-center text-zinc-700 dark:text-zinc-300"
                role="status"
                aria-live="polite"
              >
                Chargement...
              </p>
            ) : (
              <>
                <Dashboard tasks={tasks} />
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
              </>
            )}
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
