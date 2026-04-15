"use client";

const priorityConfig = {
  haute: { bg: "bg-[#ffb4ab]/10", text: "text-[#ffb4ab]", dot: "bg-[#ffb4ab]" },
  moyenne: { bg: "bg-white/5", text: "text-[#c0c7d6]", dot: "bg-[#c0c7d6]" },
  basse: { bg: "bg-[#4ae176]/10", text: "text-[#4ae176]", dot: "bg-[#4ae176]" },
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
  const badge = priorityConfig[priority] ?? priorityConfig.moyenne;

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#1f1f25] p-3 transition-all duration-150 hover:bg-[#2a292f] sm:gap-4 sm:p-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={
          completed
            ? `Marquer « ${title} » comme non complétée`
            : `Marquer « ${title} » comme complétée`
        }
        className="mt-0.5 shrink-0 transition-all duration-150"
        onClick={() => onToggle(id)}
      >
        {completed ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#4ae176] bg-[#4ae176]">
            <span
              className="material-symbols-outlined text-[#003915]"
              style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}
            >
              check
            </span>
          </span>
        ) : (
          <span className="flex h-5 w-5 rounded-full border border-white/30 transition-colors duration-150 hover:border-[#b5c4ff]" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <h3
            className={`truncate text-sm font-medium ${
              completed ? "text-[#8d90a0] line-through" : "text-[#e4e1e9]"
            }`}
          >
            {title}
          </h3>
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${badge.bg} ${badge.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            {priority}
          </span>
        </div>
        {description && String(description).trim() !== "" && (
          <p className="mt-1 line-clamp-1 text-xs text-[#8d90a0]">
            {String(description).trim()}
          </p>
        )}
      </div>

      <button
        type="button"
        className="shrink-0 p-1 text-[#8d90a0] opacity-100 transition-all duration-150 hover:text-[#ffb4ab] sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Supprimer la tâche « ${title} »`}
        onClick={() => onDelete(id)}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
      </button>
    </div>
  );
}
