"use client";

const SEARCH_INPUT_ID = "task-search-query";

export default function SearchBar({ value = "", onChange }) {
  function handleClear() {
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    });
  }

  return (
    <div className="relative w-full">
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        Rechercher une tâche
      </label>
      <span
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500"
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        id={SEARCH_INPUT_ID}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e)}
        placeholder="Rechercher par titre ou description…"
        autoComplete="off"
        className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400 transition-colors hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40 dark:text-zinc-500 dark:hover:text-zinc-300"
          aria-label="Effacer la recherche"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
