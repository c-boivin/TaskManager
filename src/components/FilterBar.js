"use client";

export const TASK_STATUS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

export function compareTasksByPriorityHighFirst(a, b) {
  const rank = { haute: 0, moyenne: 1, basse: 2 };
  return (rank[a.priority] ?? 99) - (rank[b.priority] ?? 99);
}

const FILTERS = [
  { value: TASK_STATUS.ALL, label: "Toutes" },
  { value: TASK_STATUS.ACTIVE, label: "Actives" },
  { value: TASK_STATUS.COMPLETED, label: "Complétées" },
];

export default function FilterBar({
  currentFilter = TASK_STATUS.ALL,
  onFilterChange,
}) {
  return (
    <div
      className="flex gap-0 rounded-lg bg-[#1f1f25] p-1"
      role="group"
      aria-label="Filtrer les tâches par statut"
    >
      {FILTERS.map(({ value, label }) => {
        const isActive = currentFilter === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange?.(value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              isActive
                ? "bg-[#35343a] text-[#e4e1e9]"
                : "text-[#8d90a0] hover:text-[#e4e1e9]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
