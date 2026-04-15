"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <p className="text-[8rem] font-extrabold leading-none tracking-tighter text-muted/20 sm:text-[12rem]">
        500
      </p>
      <h1 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
        Quelque chose s&apos;est mal passé
      </h1>
      <p className="mt-2 max-w-md text-center text-sm text-muted">
        {error?.message || "Une erreur inattendue est survenue. Veuillez réessayer."}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
          Réessayer
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-150 hover:border-border-strong hover:bg-white/5 active:scale-95"
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  );
}
