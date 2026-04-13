"use client";

const priorityBadgeClass = {
  haute: "bg-red-100 text-red-700 border-red-200",
  moyenne: "bg-orange-100 text-orange-700 border-orange-200",
  basse: "bg-green-100 text-green-700 border-green-200",
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
      className={`flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${completed ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={
          completed
            ? "Marquer comme non complétée"
            : "Marquer comme complétée"
        }
        className={`flex-shrink-0 ${completed ? "text-blue-600" : "text-gray-400 hover:text-blue-500"}`}
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
            className={`truncate font-semibold text-gray-900 ${completed ? "text-gray-500 line-through" : ""}`}
          >
            {title}
          </h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${badgeClass}`}
          >
            {priority}
          </span>
        </div>
        {description ? (
          <p className="truncate text-sm text-gray-600">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
        aria-label="Supprimer la tâche"
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
