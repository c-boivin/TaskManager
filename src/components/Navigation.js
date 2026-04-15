"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const { user, loading, signOut } = useContext(AuthContext);

  const navLinks = [
    { href: "/tasks", label: "Mes tâches", icon: "check_circle" },
    { href: "/shared", label: "Partagées", icon: "group" },
  ];

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 h-14 border-b border-white/[0.08] bg-[rgba(10,10,15,0.8)] backdrop-blur-xl sm:h-16">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-[#e4e1e9] transition-colors hover:text-[#b5c4ff] sm:text-lg"
          >
            <span
              className="material-symbols-outlined text-[#648aff]"
              style={{ fontSize: 22 }}
            >
              task_alt
            </span>
            <span className="hidden xs:inline">TaskManager</span>
            <span className="xs:hidden">TaskManager</span>
          </Link>

          {user && (
            <ul className="hidden items-center gap-1 sm:flex">
              {navLinks.map(({ href, label, icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-[#648aff]/15 text-[#b5c4ff]"
                          : "text-[#8d90a0] hover:bg-white/5 hover:text-[#e4e1e9]"
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {icon}
                      </span>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {loading ? (
              <div className="h-4 w-16 animate-pulse rounded bg-white/5 sm:w-24" />
            ) : user ? (
              <>
                <span className="hidden max-w-[10rem] truncate text-sm text-[#8d90a0] md:block" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-sm font-medium text-[#8d90a0] transition-all duration-150 hover:bg-white/5 hover:text-[#e4e1e9] active:scale-95 sm:px-3"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    logout
                  </span>
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#8d90a0] transition-colors hover:text-[#e4e1e9]"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-gradient-to-br from-[#b5c4ff] to-[#648aff] px-3 py-1.5 text-sm font-semibold text-[#131318] transition-all duration-150 hover:shadow-lg hover:shadow-[#648aff]/20 active:scale-95 sm:px-4"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[rgba(10,10,15,0.95)] backdrop-blur-xl sm:hidden" aria-label="Navigation mobile">
          <div className="flex h-14 items-stretch">
            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? "text-[#b5c4ff]"
                      : "text-[#8d90a0]"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                    {icon}
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
