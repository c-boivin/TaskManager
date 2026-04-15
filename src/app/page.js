import Link from "next/link";

export const metadata = {
  title: "TaskManager — Organisez votre quotidien",
};

const features = [
  {
    icon: "bolt",
    title: "Rapide & intuitif",
    description: "Ajoutez, filtrez et organisez vos tâches en quelques clics. Zéro friction.",
  },
  {
    icon: "group",
    title: "Collaboration en temps réel",
    description: "Partagez des listes avec votre équipe et suivez la progression ensemble.",
  },
  {
    icon: "shield",
    title: "Sécurisé par Firebase",
    description: "Authentification robuste et données synchronisées en temps réel sur tous vos appareils.",
  },
];

function MockDashboard() {
  return (
    <div className="w-full max-w-[340px] rounded-xl border border-border bg-card p-4 shadow-2xl sm:max-w-[420px]">
      <div className="mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>task_alt</span>
        <span className="text-sm font-semibold text-foreground">Mes tâches</span>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">3 actives</span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-primary to-primary-container" />
      </div>
      <div className="flex flex-col gap-2">
        {[
          { title: "Préparer la présentation", priority: "haute", done: true, dot: "bg-[#ffb4ab]", badgeBg: "bg-[#ffb4ab]/10", badgeText: "text-[#ffb4ab]" },
          { title: "Revoir le design system", priority: "moyenne", done: true, dot: "bg-[#c0c7d6]", badgeBg: "bg-white/5", badgeText: "text-[#c0c7d6]" },
          { title: "Déployer en production", priority: "haute", done: false, dot: "bg-[#ffb4ab]", badgeBg: "bg-[#ffb4ab]/10", badgeText: "text-[#ffb4ab]" },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-[#0a0a0f]/50 px-3 py-2">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${t.done ? "border-[#4ae176] bg-[#4ae176]" : "border-white/20"}`}>
              {t.done && (
                <span className="material-symbols-outlined text-[#003915]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check</span>
              )}
            </span>
            <span className={`flex-1 text-sm ${t.done ? "text-[#8d90a0] line-through" : "text-[#e4e1e9]"}`}>{t.title}</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${t.badgeBg} ${t.badgeText}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              {t.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,138,255,0.08)_0%,transparent_70%)]" />

        <h1 className="animate-fade-in-up relative z-10 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Organisez vos tâches,{" "}
          <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            simplement
          </span>
        </h1>

        <p className="animate-fade-in-up relative z-10 mt-4 max-w-lg text-center text-base text-muted sm:mt-6 sm:text-lg" style={{ animationDelay: "0.1s" }}>
          Un gestionnaire de tâches moderne, collaboratif et sécurisé. Gérez vos projets personnels et en équipe au même endroit.
        </p>

        <div className="animate-fade-in-up relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-surface shadow-lg shadow-primary-container/20 transition-all duration-150 hover:shadow-xl hover:shadow-primary-container/30 active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rocket_launch</span>
            Commencer
          </Link>
        </div>

        <div className="animate-fade-in-up relative z-10 mt-16" style={{ animationDelay: "0.35s", perspective: "1200px" }}>
          <div className="animate-float" style={{ transformStyle: "preserve-3d", transform: "rotateX(12deg) rotateY(-8deg)" }}>
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-surface px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-150 hover:border-border-strong hover:bg-card-hover"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container/10">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 22 }}>
                    {f.icon}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>task_alt</span>
            TaskManager
          </div>
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} TaskManager. Projet ECV.
          </p>
        </div>
      </footer>
    </div>
  );
}
