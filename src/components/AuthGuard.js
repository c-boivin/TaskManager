"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function AuthGuard({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading || user) return;
    router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    const message = loading
      ? "Chargement..."
      : "Redirection vers la connexion...";
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12"
        role="status"
        aria-live="polite"
      >
        <div
          className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-primary"
          aria-hidden
        />
        <p className="text-sm text-muted">{message}</p>
      </div>
    );
  }

  return children;
}
