"use client";

import { useId, useMemo, useState } from "react";
import Dashboard from "./Dashboard";
import SearchBar from "./SearchBar";
import FilterBar, {
  compareTasksByPriorityHighFirst,
  TASK_STATUS,
} from "./FilterBar";
import TaskItem from "./TaskItem";

const PRIORITIES = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
];

function createdAtMillis(createdAt) {
  if (createdAt == null) return 0;
  if (typeof createdAt === "number") return createdAt;
  if (typeof createdAt?.toMillis === "function") return createdAt.toMillis();
  if (typeof createdAt?.seconds === "number") {
    return createdAt.seconds * 1000 + Math.floor((createdAt.nanoseconds ?? 0) / 1e6);
  }
  return 0;
}

export default function SharedListView({
  list,
  tasks,
  currentUserId,
  members,
  onAddMember,
  onRemoveMember,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
}) {
  const formId = useId();
  const isOwner = list?.ownerId === currentUserId;
  const taskList = useMemo(() => tasks ?? [], [tasks]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(TASK_STATUS.ALL);
  const [sortOrder, setSortOrder] = useState("priority");

  const { activeCount, totalCount } = useMemo(() => {
    const total = taskList.length;
    const active = taskList.filter((t) => t.completed !== true).length;
    return { activeCount: active, totalCount: total };
  }, [taskList]);

  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return taskList
      .filter((task) => {
        if (q === "") return true;
        const inTitle = (task.title ?? "").toLowerCase().includes(q);
        const inDescription = (task.description ?? "").toLowerCase().includes(q);
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
  }, [taskList, searchQuery, statusFilter, sortOrder]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-shrink-0 rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Retour à la vue principale"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {list?.name ?? "Liste partagée"}
        </h1>
      </div>

      <MembersSection
        members={members}
        ownerId={list?.ownerId}
        isOwner={isOwner}
        currentUserId={currentUserId}
        onRemoveMember={onRemoveMember}
      />

      {isOwner && <AddMemberForm formId={formId} onAddMember={onAddMember} />}

      <SharedTaskForm onAddTask={onAddTask} />

      <section aria-label="Tâches partagées" className="flex flex-col gap-4">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tâches ({taskList.length})
        </h2>

        <Dashboard tasks={taskList} />

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
            htmlFor="shared-task-sort-order"
            className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Trier par
          </label>
          <select
            id="shared-task-sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
          >
            <option value="priority">Priorité (hautes → basses)</option>
            <option value="date">Date (plus anciennes d&apos;abord)</option>
          </select>
        </div>

        {taskList.length > 0 && visibleTasks.length === 0 ? (
          <p className="py-8 text-center text-zinc-700 dark:text-zinc-300">
            Aucune tâche ne correspond à ces critères.
          </p>
        ) : taskList.length === 0 ? (
          <p className="py-8 text-center text-zinc-700 dark:text-zinc-300">
            Aucune tâche pour le moment
          </p>
        ) : (
          <ul className="flex flex-col gap-4" aria-label="Liste des tâches partagées">
            {visibleTasks.map((task) => (
              <li key={task.id}>
                <div className="relative">
                  <TaskItem
                    id={task.id}
                    title={task.title}
                    description={typeof task.description === "string" ? task.description : ""}
                    priority={task.priority}
                    completed={task.completed}
                    onToggle={(id) => onUpdateTask(id, { completed: !task.completed })}
                    onDelete={onDeleteTask}
                  />
                  {task.addedBy && (
                    <span className="mt-1 block text-right text-xs text-zinc-500 dark:text-zinc-400">
                      Ajoutée par{" "}
                      <span className="font-medium">
                        {task.addedBy === currentUserId
                          ? "vous"
                          : members?.find((m) => m.uid === task.addedBy)?.email ?? task.addedBy}
                      </span>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MembersSection({ members, ownerId, isOwner, currentUserId, onRemoveMember }) {
  const memberList = members ?? [];

  const sortedMembers = [...memberList].sort((a, b) => {
    if (a.uid === ownerId) return -1;
    if (b.uid === ownerId) return 1;
    return 0;
  });

  return (
    <section
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      aria-label="Membres de la liste"
    >
      <h2 className="mb-3 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Membres ({memberList.length})
      </h2>

      {memberList.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Aucun membre</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sortedMembers.map((member) => {
            const isMemberOwner = member.uid === ownerId;

            return (
              <li
                key={member.uid}
                className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-700"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={
                      isMemberOwner
                        ? "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                        : "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                    }
                  >
                    {(member.email?.[0] ?? "?").toUpperCase()}
                  </div>
                  <span className="truncate text-sm text-zinc-800 dark:text-zinc-200">
                    {member.email ?? member.uid}
                  </span>
                  {isMemberOwner && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      Propriétaire
                    </span>
                  )}
                  {member.uid === currentUserId && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      vous
                    </span>
                  )}
                </div>

                {isOwner && member.uid !== currentUserId && !isMemberOwner && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(member.uid)}
                    className="flex-shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    aria-label={`Retirer ${member.email ?? member.uid}`}
                  >
                    Retirer
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function AddMemberForm({ formId, onAddMember }) {
  const emailId = `${formId}-member-email`;
  const errorId = `${formId}-member-error`;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setError("L'email est requis.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddMember(trimmed);
      setEmail("");
    } catch (err) {
      setError(err?.message ?? "Impossible d'ajouter ce membre.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasError = Boolean(error);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      noValidate
    >
      <h2 className="mb-3 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Ajouter un membre
      </h2>

      {hasError && (
        <p
          id={errorId}
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-grow text-left">
          <label
            htmlFor={emailId}
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Email du membre
          </label>
          <input
            id={emailId}
            type="email"
            required
            aria-required="true"
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="nom@exemple.com"
            className={
              hasError
                ? "w-full rounded-lg border border-red-500 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/25 dark:border-red-500 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                : "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            }
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-[42px] w-full shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Ajout…" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}

function SharedTaskForm({ onAddTask }) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const priorityId = `${formId}-priority`;
  const titleErrorId = `${formId}-title-error`;
  const submitErrorId = `${formId}-submit-error`;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("moyenne");
  const [titleError, setTitleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInvalid = Boolean(titleError);
  const descriptionId = `${formId}-description`;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("Le titre ne peut pas être vide.");
      return;
    }
    setTitleError("");

    setIsSubmitting(true);
    try {
      await onAddTask({ title: trimmed, description: description.trim(), priority });
      setTitle("");
      setDescription("");
      setPriority("moyenne");
    } catch (err) {
      setSubmitError(err?.message ?? "L'ajout de la tâche a échoué. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      noValidate
      aria-describedby={submitError ? submitErrorId : undefined}
    >
      <h2 className="mb-4 text-center text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Ajouter une tâche partagée
      </h2>

      {submitError && (
        <p
          id={submitErrorId}
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="min-w-0 text-left">
          <label
            htmlFor={titleId}
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Titre <span className="text-red-600 dark:text-red-400">(obligatoire)</span>
          </label>
          <input
            id={titleId}
            name="title"
            type="text"
            required
            aria-required="true"
            aria-invalid={titleInvalid}
            aria-describedby={titleInvalid ? titleErrorId : undefined}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            placeholder="Nom de la tâche"
            className={
              titleInvalid
                ? "w-full rounded-lg border border-red-500 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/25 dark:border-red-500 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                : "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            }
          />
          {titleInvalid && (
            <p
              id={titleErrorId}
              className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              role="alert"
            >
              {titleError}
            </p>
          )}
        </div>

        <div className="min-w-0 text-left">
          <label
            htmlFor={descriptionId}
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Description
          </label>
          <textarea
            id={descriptionId}
            name="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails de la tâche (optionnel)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="w-full text-left sm:w-40">
            <label
              htmlFor={priorityId}
              className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Priorité
            </label>
            <select
              id={priorityId}
              name="priority"
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
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-[42px] w-full shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:opacity-60 sm:ml-auto sm:w-auto"
          >
            {isSubmitting ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      </div>
    </form>
  );
}
