"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function UserMenu() {
  const { user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) {
    return null;
  }

  const email = user.email ?? "";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex max-w-[min(100%,14rem)] items-center gap-2 sm:max-w-xs sm:gap-3 md:max-w-md">
      <p
        className="min-w-0 truncate text-sm text-zinc-600 dark:text-zinc-400"
        title={email || undefined}
      >
        <span className="sr-only">Compte connecté : </span>
        {email || "—"}
      </p>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {signingOut ? "Déconnexion..." : "Se déconnecter"}
      </button>
    </div>
  );
}
