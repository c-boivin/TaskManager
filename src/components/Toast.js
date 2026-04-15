"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STYLE = {
  success: "border-[#4ae176]/20 bg-[#4ae176]/5",
  error: "border-[#ffb4ab]/20 bg-[#ffb4ab]/5",
};

const ICON = {
  success: "check_circle",
  error: "error",
};

const ICON_COLOR = {
  success: "text-[#4ae176]",
  error: "text-[#ffb4ab]",
};

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration ?? 3500);

    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  function handleDismiss() {
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }

  const type = toast.type ?? "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm transition-all duration-300 ${STYLE[type]} ${
        exiting ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <span className={`material-symbols-outlined shrink-0 ${ICON_COLOR[type]}`} style={{ fontSize: 20 }}>
        {ICON[type]}
      </span>
      <p className="min-w-0 flex-1 text-sm font-medium text-[#e4e1e9]">{toast.message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1 text-[#8d90a0] transition-colors hover:text-[#e4e1e9]"
        aria-label="Fermer la notification"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

let nextId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "success", duration = 3500) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const success = useCallback((msg) => toast(msg, "success"), [toast]);
  const error = useCallback((msg) => toast(msg, "error"), [toast]);

  return { toasts, dismiss, toast, success, error };
}
