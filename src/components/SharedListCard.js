"use client";

export default function SharedListCard({ list, currentUserId, onOpen, onDelete }) {
  const isOwner = list.ownerId === currentUserId;
  const memberCount = list.members?.length ?? 0;
  const totalTasks = list.taskCount ?? 0;
  const completedTasks = list.completedCount ?? 0;

  return (
    <article
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
      aria-label={`Liste partagée : ${list.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {list.name}
        </h3>
        {isOwner && (
          <span className="flex-shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            Propriétaire
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {memberCount} {memberCount > 1 ? "membres" : "membre"}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {completedTasks}/{totalTasks} tâche{totalTasks > 1 ? "s" : ""}{" "}
          {totalTasks > 1 ? "complétées" : "complétée"}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          onClick={() => onOpen(list.id)}
          aria-label={`Ouvrir la liste « ${list.name} »`}
        >
          Ouvrir
        </button>

        {isOwner && (
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:ring-offset-zinc-950"
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
