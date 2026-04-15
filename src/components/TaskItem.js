"use client";

const priorityBadgeClass = {
  haute: "bg-red-100 text-red-900 border-red-300",
  moyenne: "bg-orange-100 text-orange-900 border-orange-300",
  basse: "bg-green-100 text-green-900 border-green-300",
};

export default function TaskItem({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
}) {
  const badgeClass = priorityBadgeClass[priority] ?? priorityBadgeClass.moyenne;

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border border-zinc-200 p-4 shadow-sm dark:border-zinc-700 ${
        completed ? "bg-zinc-100 dark:bg-zinc-900" : "bg-white dark:bg-zinc-950"
      }`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={
          completed
            ? `Marquer « ${title} » comme non complétée`
            : `Marquer « ${title} » comme complétée`
        }
        className={`mt-0.5 flex-shrink-0 ${completed ? "text-blue-700 dark:text-blue-400" : "text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"}`}
        onClick={() => onToggle(id)}
      >
        {completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-grow">
        <div className="mb-1 flex items-center gap-2">
          <h3
            className={`truncate font-semibold ${completed ? "text-zinc-600 line-through dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-50"}`}
          >
            {title}
          </h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${badgeClass}`}
            aria-label={`Priorité : ${priority}`}
          >
            {priority}
          </span>
        </div>
        {description && String(description).trim() !== "" ? (
          <p
            className={`break-words text-left text-sm whitespace-pre-wrap ${completed ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-800 dark:text-zinc-200"}`}
          >
            {String(description).trim()}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className="mt-0.5 flex-shrink-0 rounded-lg p-2 text-zinc-600 hover:bg-red-50 hover:text-red-700 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        aria-label={`Supprimer la tâche « ${title} »`}
        onClick={() => onDelete(id)}
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
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>
    </div>
  );
}
