"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/#tasks", label: "Tâches" },
];

export default function Header() {
  const { user, loading } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200"
        >
          TaskManager
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-6">
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-6 sm:gap-8">
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 shrink-0">
            {loading ? (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                …
              </span>
            ) : user ? (
              <UserMenu />
            ) : (
              <ul className="flex items-center gap-2 sm:gap-3">
                <li>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Inscription
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
