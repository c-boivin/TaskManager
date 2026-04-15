"use client";

import { useContext, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function AuthGuard({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useLayoutEffect(() => {
    if (loading || user) return;
    router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    const message = loading
      ? "Chargement..."
      : "Redirection vers la connexion...";
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
        role="status"
        aria-live="polite"
      >
        <div
          className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200"
          aria-hidden
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
      </div>
    );
  }

  return children;
}
