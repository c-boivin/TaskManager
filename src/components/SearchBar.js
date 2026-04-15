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
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8d90a0]">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
      </span>
      <input
        id={SEARCH_INPUT_ID}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e)}
        placeholder="Rechercher par titre ou description…"
        autoComplete="off"
        className="w-full rounded-lg border border-white/[0.08] bg-[#1f1f25] py-2 pl-9 pr-10 text-sm text-[#e4e1e9] placeholder:text-[#8d90a0] focus:outline-none focus:ring-1 focus:ring-[#b5c4ff]/30"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-[#8d90a0] transition-colors duration-150 hover:text-[#e4e1e9]"
          aria-label="Effacer la recherche"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      ) : null}
    </div>
  );
}
