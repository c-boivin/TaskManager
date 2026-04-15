import Link from "next/link";

export const metadata = {
  title: "404 — Page introuvable",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <p className="text-[8rem] font-extrabold leading-none tracking-tighter text-muted/20 sm:text-[12rem]">
        404
      </p>
      <h1 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
        Page introuvable
      </h1>
      <p className="mt-2 max-w-md text-center text-sm text-muted">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
