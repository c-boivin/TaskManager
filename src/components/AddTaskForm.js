"use client";

import { useId, useState } from "react";

const PRIORITIES = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
];

export default function AddTaskForm({ onAddTask }) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const descriptionId = `${formId}-description`;
  const priorityId = `${formId}-priority`;
  const titleErrorId = `${formId}-title-error`;
  const submitErrorId = `${formId}-submit-error`;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("moyenne");
  const [titleError, setTitleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInvalid = Boolean(titleError);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("Le titre ne peut pas être vide.");
      return;
    }
    setTitleError("");

    if (!onAddTask) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title: trimmed,
        priority,
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      setPriority("moyenne");
    } catch (err) {
      setSubmitError(err?.message ?? "L’ajout de la tâche a échoué. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      noValidate
      aria-describedby={submitError ? submitErrorId : undefined}
    >
      <h2 className="mb-4 text-center text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Ajouter une nouvelle tâche
      </h2>

      {submitError ? (
        <p
          id={submitErrorId}
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="min-w-0 text-left">
          <label
            htmlFor={titleId}
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Titre <span className="text-red-600 dark:text-red-400">(obligatoire)</span>
          </label>
          <input
            id={titleId}
            name="title"
            type="text"
            required
            aria-required="true"
            aria-invalid={titleInvalid}
            aria-describedby={titleInvalid ? titleErrorId : undefined}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            placeholder="Nom de la tâche"
            className={
              titleInvalid
                ? "w-full rounded-lg border border-red-500 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/25 dark:border-red-500 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                : "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            }
          />
          {titleInvalid ? (
            <p
              id={titleErrorId}
              className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              role="alert"
            >
              {titleError}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 text-left">
          <label
            htmlFor={descriptionId}
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Description <span className="text-zinc-500">(optionnel)</span>
          </label>
          <textarea
            id={descriptionId}
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails ou contexte"
            className="min-h-[5.5rem] w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="w-full text-left sm:w-40">
            <label
              htmlFor={priorityId}
              className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Priorité
            </label>
            <select
              id={priorityId}
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-[42px] w-full shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:opacity-60 sm:ml-auto sm:w-auto"
          >
            {isSubmitting ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      </div>
    </form>
  );
}
