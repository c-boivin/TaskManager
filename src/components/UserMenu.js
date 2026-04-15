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
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[10rem] truncate text-sm text-muted sm:block" title={email || undefined}>
        {email || "—"}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-all duration-150 hover:border-border-strong hover:bg-white/5 hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
        <span className="hidden sm:inline">{signingOut ? "Déconnexion..." : "Déconnexion"}</span>
      </button>
    </div>
  );
}
