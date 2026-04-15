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
  { value: "basse", label: "Basse", color: "bg-[#4ae176]" },
  { value: "moyenne", label: "Moyenne", color: "bg-[#c0c7d6]" },
  { value: "haute", label: "Haute", color: "bg-[#ffb4ab]" },
];

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

const AVATAR_COLORS = [
  "bg-primary-container/20 text-primary",
  "bg-tertiary/20 text-tertiary",
  "bg-amber-500/20 text-amber-400",
  "bg-pink-500/20 text-pink-400",
  "bg-cyan-500/20 text-cyan-400",
];

function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
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
  }, [taskList, searchQuery, statusFilter, sortOrder]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-lg border border-border p-1.5 text-muted transition-all duration-150 hover:bg-white/5 hover:text-foreground active:scale-95 sm:p-2"
          aria-label="Retour à la vue principale"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            arrow_back
          </span>
        </button>
        <h1 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {list?.name ?? "Liste partagée"}
        </h1>
      </div>

      {/* Members */}
      <MembersSection
        members={members}
        ownerId={list?.ownerId}
        isOwner={isOwner}
        currentUserId={currentUserId}
        onRemoveMember={onRemoveMember}
      />

      {isOwner && <AddMemberForm formId={formId} onAddMember={onAddMember} />}

      {/* Add Task */}
      <SharedTaskForm onAddTask={onAddTask} />

      {/* Tasks */}
      <section aria-label="Tâches partagées" className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span
            className="material-symbols-outlined text-primary-container"
            style={{ fontSize: 20 }}
          >
            checklist
          </span>
          Tâches ({taskList.length})
        </h2>

        <Dashboard tasks={taskList} />

        <div className="flex flex-col gap-3">
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
              id="shared-task-sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-lg border border-white/[0.08] bg-[#1f1f25] px-3 py-2 text-sm text-[#8d90a0] focus:outline-none focus:ring-1 focus:ring-[#b5c4ff]/30"
              aria-label="Trier par"
            >
              <option value="priority">Priorité</option>
              <option value="date">Date</option>
            </select>
            <span className="ml-auto text-xs text-[#8d90a0]" aria-live="polite">
              {activeCount === 1
                ? `1 tâche active sur ${totalCount}`
                : `${activeCount} actives sur ${totalCount}`}
            </span>
          </div>
        </div>

        {taskList.length > 0 && visibleTasks.length === 0 ? (
          <p className="py-8 text-center text-muted">
            Aucune tâche ne correspond à ces critères.
          </p>
        ) : taskList.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <span
              className="material-symbols-outlined text-muted/30"
              style={{ fontSize: 48 }}
            >
              task
            </span>
            <p className="text-muted">Aucune tâche pour le moment</p>
          </div>
        ) : (
          <ul
            className="flex flex-col gap-2"
            aria-label="Liste des tâches partagées"
          >
            {visibleTasks.map((task) => (
              <li key={task.id}>
                <div className="relative">
                  <TaskItem
                    id={task.id}
                    title={task.title}
                    description={
                      typeof task.description === "string"
                        ? task.description
                        : ""
                    }
                    priority={task.priority}
                    completed={task.completed}
                    onToggle={(id) =>
                      onUpdateTask(id, { completed: !task.completed })
                    }
                    onDelete={onDeleteTask}
                  />
                  {task.addedBy && (
                    <span className="mt-1 block text-right text-xs text-muted">
                      Ajoutée par{" "}
                      <span className="font-medium text-foreground/70">
                        {task.addedBy === currentUserId
                          ? "vous"
                          : (members?.find((m) => m.uid === task.addedBy)
                              ?.email ?? task.addedBy)}
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

function MembersSection({
  members,
  ownerId,
  isOwner,
  currentUserId,
  onRemoveMember,
}) {
  const memberList = members ?? [];

  const sortedMembers = [...memberList].sort((a, b) => {
    if (a.uid === ownerId) return -1;
    if (b.uid === ownerId) return 1;
    return 0;
  });

  return (
    <section
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
      aria-label="Membres de la liste"
    >
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: 20 }}
        >
          group
        </span>
        Membres ({memberList.length})
      </h2>

      {memberList.length === 0 ? (
        <p className="text-sm text-muted">Aucun membre</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sortedMembers.map((member, index) => {
            const isMemberOwner = member.uid === ownerId;

            return (
              <li
                key={member.uid}
                className="flex items-center justify-between gap-2 rounded-lg border border-border px-2.5 py-2 transition-colors hover:bg-white/[0.02] sm:px-3"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${getAvatarColor(index)}`}
                  >
                    {(member.email?.[0] ?? "?").toUpperCase()}
                  </div>
                  <span className="truncate text-xs text-foreground sm:text-sm">
                    {member.email ?? member.uid}
                  </span>
                  {isMemberOwner && (
                    <span className="hidden shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 sm:inline sm:text-xs">
                      Propriétaire
                    </span>
                  )}
                  {member.uid === currentUserId && (
                    <span className="hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:inline sm:text-xs">
                      vous
                    </span>
                  )}
                </div>

                {isOwner && member.uid !== currentUserId && !isMemberOwner && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(member.uid)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-error/70 transition-colors hover:bg-error/10 hover:text-error"
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
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
      noValidate
    >
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: 20 }}
        >
          person_add
        </span>
        Ajouter un membre
      </h2>

      {hasError && (
        <div
          id={errorId}
          className="mb-3 rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-grow">
          <label
            htmlFor={emailId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Email du membre
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                mail
              </span>
            </span>
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
              className={`w-full rounded-lg border bg-[#0e0e13] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 ${
                hasError
                  ? "border-error/40 focus:ring-error/20"
                  : "border-border focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            person_add
          </span>
          {isSubmitting ? "Ajout…" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}

function SharedTaskForm({ onAddTask }) {
  const formId = useId();
  const titleId = `${formId}-title`;
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
      await onAddTask({
        title: trimmed,
        description: description.trim(),
        priority,
      });
      setTitle("");
      setDescription("");
      setPriority("moyenne");
    } catch (err) {
      setSubmitError(
        err?.message ?? "L'ajout de la tâche a échoué. Réessayez.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
      noValidate
      aria-describedby={submitError ? submitErrorId : undefined}
    >
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: 20 }}
        >
          add_task
        </span>
        Ajouter une tâche partagée
      </h2>

      {submitError && (
        <div
          id={submitErrorId}
          className="mb-4 rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-sm text-error"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor={titleId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Titre <span className="text-error">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                edit
              </span>
            </span>
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
              className={`w-full rounded-lg border bg-[#0e0e13] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 ${
                titleInvalid
                  ? "border-error/40 focus:ring-error/20"
                  : "border-border focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
          </div>
          {titleInvalid && (
            <p
              id={titleErrorId}
              className="mt-1.5 text-xs text-error"
              role="alert"
            >
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={descriptionId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Description <span className="text-muted">(optionnel)</span>
          </label>
          <textarea
            id={descriptionId}
            name="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails de la tâche"
            className="w-full resize-y rounded-lg border border-border bg-[#0e0e13] px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <fieldset>
            <legend className="sr-only">Priorité</legend>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <label
                  key={p.value}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border bg-[#35343a] px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                    priority === p.value
                      ? "border-white/[0.04] ring-1 ring-white/20"
                      : "border-white/[0.04]"
                  }`}
                >
                  <input
                    type="radio"
                    name="shared-priority"
                    value={p.value}
                    checked={priority === p.value}
                    onChange={() => setPriority(p.value)}
                    className="sr-only"
                  />
                  <span className={`h-2 w-2 rounded-full ${p.color}`} />
                  <span className="text-[#e4e1e9]">{p.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
            >
              add
            </span>
            {isSubmitting ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      </div>
    </form>
  );
}
