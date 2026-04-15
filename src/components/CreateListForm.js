"use client";

import { useId, useState } from "react";

export default function CreateListForm({ onCreateList }) {
  const formId = useId();
  const nameId = `${formId}-name`;
  const nameErrorId = `${formId}-name-error`;
  const submitErrorId = `${formId}-submit-error`;

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInvalid = Boolean(nameError);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Le nom de la liste ne peut pas être vide.");
      return;
    }
    setNameError("");

    if (!onCreateList) return;

    setIsSubmitting(true);
    try {
      await onCreateList(trimmed);
      setName("");
    } catch (err) {
      setSubmitError(
        err?.message ?? "La création de la liste a échoué. Réessayez."
      );
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
        Créer une nouvelle liste
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 text-left">
          <label
            htmlFor={nameId}
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Nom de la liste{" "}
            <span className="text-red-600 dark:text-red-400">(obligatoire)</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            aria-required="true"
            aria-invalid={nameInvalid}
            aria-describedby={nameInvalid ? nameErrorId : undefined}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="Ex : Courses, Vacances…"
            className={
              nameInvalid
                ? "w-full rounded-lg border border-red-500 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/25 dark:border-red-500 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                : "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            }
          />
          {nameInvalid ? (
            <p
              id={nameErrorId}
              className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              role="alert"
            >
              {nameError}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-[42px] w-full shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Création…" : "Créer"}
        </button>
      </div>
    </form>
  );
}
