"use client";

import { useId, useState } from "react";

const PRIORITIES = [
  { value: "basse", label: "Basse", color: "bg-[#4ae176]" },
  { value: "moyenne", label: "Moyenne", color: "bg-[#c0c7d6]" },
  { value: "haute", label: "Haute", color: "bg-[#ffb4ab]" },
];

export default function AddTaskForm({ onAddTask }) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const descriptionId = `${formId}-description`;
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
      setSubmitError(err?.message ?? "L'ajout de la tâche a échoué. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/[0.08] bg-[#1f1f25] p-4 sm:p-5"
      noValidate
      aria-describedby={submitError ? submitErrorId : undefined}
    >
      {submitError && (
        <div
          id={submitErrorId}
          className="mb-4 rounded-lg border border-[#ffb4ab]/20 bg-[#ffb4ab]/5 px-3 py-2 text-sm text-[#ffb4ab]"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-0">
        <div>
          <label htmlFor={titleId} className="sr-only">Titre</label>
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
            placeholder="Titre de la tâche"
            className="w-full border-none bg-transparent text-base font-medium text-[#e4e1e9] placeholder:text-[#8d90a0] focus:outline-none focus:ring-0 sm:text-lg"
          />
          {titleInvalid && (
            <p id={titleErrorId} className="mt-1 text-xs text-[#ffb4ab]" role="alert">
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={descriptionId} className="sr-only">Description</label>
          <textarea
            id={descriptionId}
            name="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            className="w-full resize-none border-none bg-transparent text-sm text-[#e4e1e9] placeholder:text-[#8d90a0] focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className="border-t border-white/[0.08] pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <fieldset>
            <legend className="sr-only">Priorité</legend>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <label
                  key={p.value}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border bg-[#35343a] px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                    priority === p.value
                      ? "border-white/[0.04] ring-1 ring-white/20"
                      : "border-white/[0.04]"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={priority === p.value}
                    onChange={() => setPriority(p.value)}
                    className="sr-only"
                  />
                  <span className={`h-2 w-2 rounded-full ${p.color}`} />
                  <span className="text-[#e4e1e9]">{p.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-br from-[#b5c4ff] to-[#648aff] px-6 py-2 text-sm font-bold text-[#00236d] shadow-lg transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      </div>
    </form>
  );
}
