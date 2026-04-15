"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddTaskForm from "@/components/AddTaskForm";
import Dashboard from "@/components/Dashboard";
import FilterBar, {
  compareTasksByPriorityHighFirst,
  TASK_STATUS,
} from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import TaskList from "@/components/TaskList";
import { ToastContainer, useToast } from "@/components/Toast";
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
    return (
      createdAt.seconds * 1000 + Math.floor((createdAt.nanoseconds ?? 0) / 1e6)
    );
  }
  return 0;
}

export default function TasksPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const userId = user?.uid;
  const {
    toasts,
    dismiss,
    success: showSuccess,
    error: showError,
  } = useToast();

  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [error, setError] = useState(null);

  const loading = authLoading || (!tasksLoaded && !!userId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(TASK_STATUS.ALL);
  const [sortOrder, setSortOrder] = useState("priority");

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTasks(
      userId,
      (nextTasks) => {
        setTasks(nextTasks);
        setTasksLoaded(true);
        setError(null);
      },
      (err) => {
        const msg = err?.message ?? String(err);
        setError(msg);
        showError(msg);
        setTasksLoaded(true);
      },
    );

    return () => {
      unsubscribe();
      setTasks([]);
      setTasksLoaded(false);
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
      const msg = e?.message ?? String(e);
      setError(msg);
      showError(msg);
    }
  }

  async function onDelete(id) {
    if (!userId) return;
    try {
      setError(null);
      await deleteTask(userId, id);
      showSuccess("Tâche supprimée avec succès.");
    } catch (e) {
      const msg = e?.message ?? String(e);
      setError(msg);
      showError(msg);
    }
  }

  async function onAddTask({ title, priority, description }) {
    if (!userId) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    await addTask(userId, { title, priority, description });
    showSuccess("Tâche ajoutée avec succès.");
  }

  return (
    <AuthGuard>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-20 sm:px-6 sm:pt-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold tracking-tight text-[#e4e1e9] sm:text-3xl">
            Mes tâches
          </h1>
          <p className="mt-1 text-sm text-[#8d90a0]">
            Gérez et organisez vos tâches personnelles
          </p>
        </div>

        <AddTaskForm onAddTask={onAddTask} />

        <section className="mt-8" aria-labelledby="tasks-section-heading">
          <h2 id="tasks-section-heading" className="sr-only">
            Liste des tâches
          </h2>

          {error && (
            <div
              className="mb-4 rounded-xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/5 px-4 py-3 text-sm text-[#ffb4ab]"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  error
                </span>
                {error}
              </div>
            </div>
          )}

          {loading ? (
            <div role="status" aria-live="polite" className="flex flex-col">
              <div className="sr-only">Chargement des tâches...</div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="mb-2 h-20 animate-pulse rounded-xl bg-[#1f1f25]"
                />
              ))}
            </div>
          ) : (
            <>
              <Dashboard tasks={tasks} />

              <div className="mb-4 flex flex-col gap-3">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <FilterBar
                    currentFilter={statusFilter}
                    onFilterChange={setStatusFilter}
                  />
                  <select
                    id="task-sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="rounded-lg border border-white/[0.08] bg-[#1f1f25] px-3 py-2 text-sm text-[#8d90a0] focus:outline-none focus:ring-1 focus:ring-[#b5c4ff]/30"
                    aria-label="Trier par"
                  >
                    <option value="priority">Priorité</option>
                    <option value="date">Date</option>
                  </select>
                  <span
                    className="ml-auto text-xs text-[#8d90a0]"
                    aria-live="polite"
                  >
                    {activeCount === 1
                      ? `1 tâche active sur ${totalCount}`
                      : `${activeCount} actives sur ${totalCount}`}
                  </span>
                </div>
              </div>

              {tasks.length > 0 && visibleTasks.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#8d90a0]">
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
      </div>
    </AuthGuard>
  );
}
