export default function Home() {
  return (
    <div
      id="tasks"
      className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-zinc-950"
    >
      <main className="flex max-w-lg flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          TaskManager
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Gérez vos tâches efficacement
        </p>
        <button
          type="button"
          className="mt-10 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Commencer
        </button>
      </main>
    </div>
  );
}
