"use client";

export default function SharedListCard({ list, currentUserId, onOpen, onDelete }) {
  const isOwner = list.ownerId === currentUserId;
  const memberCount = list.members?.length ?? 0;
  const totalTasks = list.taskCount ?? 0;
  const completedTasks = list.completedCount ?? 0;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <article
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-150 hover:border-border-strong hover:bg-card-hover"
      aria-label={`Liste partagée : ${list.name}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="truncate text-base font-semibold text-foreground">
          {list.name}
        </h3>
        {isOwner && (
          <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
            Propriétaire
          </span>
        )}
      </div>

      <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-[width] duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span>
          {memberCount} {memberCount > 1 ? "membres" : "membre"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
          {completedTasks}/{totalTasks} tâche{totalTasks > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95"
          onClick={() => onOpen(list.id)}
          aria-label={`Ouvrir la liste « ${list.name} »`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
          Ouvrir
        </button>

        {isOwner && (
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-error/70 transition-all duration-150 hover:bg-error/10 hover:text-error active:scale-95"
            onClick={() => onDelete(list.id)}
            aria-label={`Supprimer la liste « ${list.name} »`}
          >
            Supprimer
          </button>
        )}
      </div>
    </article>
  );
}
