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
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
      noValidate
      aria-describedby={submitError ? submitErrorId : undefined}
    >
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 20 }}>playlist_add</span>
        Créer une nouvelle liste
      </h2>

      {submitError && (
        <div
          id={submitErrorId}
          className="mb-4 rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-sm text-error"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={nameId} className="mb-1.5 block text-sm font-medium text-foreground">
            Nom de la liste <span className="text-error">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
            </span>
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
              className={`w-full rounded-lg border bg-[#0e0e13] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 ${
                nameInvalid
                  ? "border-error/40 focus:ring-error/20"
                  : "border-border focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
          </div>
          {nameInvalid && (
            <p id={nameErrorId} className="mt-1.5 text-xs text-error" role="alert">
              {nameError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          {isSubmitting ? "Création…" : "Créer"}
        </button>
      </div>
    </form>
  );
}
