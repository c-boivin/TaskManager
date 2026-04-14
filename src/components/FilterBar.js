"use client";

/** Valeurs de filtre partagées avec la page (liste) pour éviter tout décalage de chaînes. */
export const TASK_STATUS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

/** Tri par priorité : haute → moyenne → basse (pour utilisation côté liste, ex. page.js). */
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
      className="flex flex-wrap gap-2"
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
            className={
              isActive
                ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                : "rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
