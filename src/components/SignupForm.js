"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function fieldsInvalidForCode(code) {
  if (!code) return { email: false, password: false };
  if (code === "auth/invalid-email" || code === "auth/email-already-in-use") {
    return { email: true, password: false };
  }
  if (code === "auth/weak-password") {
    return { email: false, password: true };
  }
  return { email: false, password: false };
}

export default function SignupForm() {
  const { signUp, error, user } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [authErrorCode, setAuthErrorCode] = useState(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/tasks");
    }
  }, [user, router]);

  const emailEmpty = touched && !email.trim();
  const passwordEmpty = touched && !password.length;
  const confirmEmpty = touched && !confirmPassword.length;

  const { email: authEmailInvalid, password: authPasswordInvalid } =
    fieldsInvalidForCode(authErrorCode);

  const emailInvalid = emailEmpty || authEmailInvalid;
  const passwordInvalid = passwordEmpty || authPasswordInvalid;
  const confirmInvalid =
    confirmEmpty || (touched && passwordMismatch && confirmPassword.length > 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    setAuthErrorCode(null);
    setPasswordMismatch(false);

    if (!email.trim() || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email.trim(), password);
    } catch (err) {
      setAuthErrorCode(err?.code ?? null);
    } finally {
      setSubmitting(false);
    }
  }

  function onEmailChange(v) {
    setEmail(v);
    if (authErrorCode) setAuthErrorCode(null);
  }

  function onPasswordChange(v) {
    setPassword(v);
    if (authErrorCode) setAuthErrorCode(null);
    if (passwordMismatch) setPasswordMismatch(false);
  }

  function onConfirmChange(v) {
    setConfirmPassword(v);
    if (passwordMismatch) setPasswordMismatch(false);
  }

  const bannerError = error;

  const emailDescribedBy = [
    emailEmpty ? "signup-email-hint" : null,
    authEmailInvalid && bannerError ? "signup-form-error" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const passwordDescribedBy = [
    passwordEmpty ? "signup-password-hint" : null,
    authPasswordInvalid && bannerError ? "signup-form-error" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const confirmDescribedBy = [
    confirmEmpty ? "signup-confirm-hint" : null,
    passwordMismatch && confirmPassword.length > 0
      ? "signup-confirm-mismatch"
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full max-w-md">
      {bannerError && (
        <div
          id="signup-form-error"
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {bannerError}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container">
            <span className="material-symbols-outlined text-surface" style={{ fontSize: 24 }}>person_add</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Inscription
          </h1>
          <p className="text-sm text-muted">Créez votre compte TaskManager</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Adresse e-mail
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
              </span>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="vous@exemple.com"
                aria-invalid={emailInvalid}
                aria-describedby={emailDescribedBy || undefined}
                className={`w-full rounded-lg border bg-[#0e0e13] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 ${
                  emailInvalid
                    ? "border-error/40 focus:ring-error/20"
                    : "border-border focus:border-primary/40 focus:ring-primary/20"
                }`}
              />
            </div>
            {emailEmpty && (
              <p id="signup-email-hint" className="mt-1.5 text-xs text-error">
                L&apos;adresse e-mail est requise.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
              </span>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Choisissez un mot de passe"
                aria-invalid={passwordInvalid}
                aria-describedby={passwordDescribedBy || undefined}
                className={`w-full rounded-lg border bg-[#0e0e13] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 ${
                  passwordInvalid
                    ? "border-error/40 focus:ring-error/20"
                    : "border-border focus:border-primary/40 focus:ring-primary/20"
                }`}
              />
            </div>
            {passwordEmpty && (
              <p id="signup-password-hint" className="mt-1.5 text-xs text-error">
                Le mot de passe est requis.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-password-confirm" className="mb-1.5 block text-sm font-medium text-foreground">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
              </span>
              <input
                id="signup-password-confirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => onConfirmChange(e.target.value)}
                placeholder="Saisissez à nouveau le mot de passe"
                aria-invalid={confirmInvalid}
                aria-describedby={confirmDescribedBy || undefined}
                className={`w-full rounded-lg border bg-[#0e0e13] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 ${
                  confirmInvalid
                    ? "border-error/40 focus:ring-error/20"
                    : "border-border focus:border-primary/40 focus:ring-primary/20"
                }`}
              />
            </div>
            {confirmEmpty && (
              <p id="signup-confirm-hint" className="mt-1.5 text-xs text-error">
                La confirmation du mot de passe est requise.
              </p>
            )}
            {passwordMismatch && confirmPassword.length > 0 && (
              <p id="signup-confirm-mismatch" className="mt-1.5 text-xs text-error">
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-lg bg-gradient-to-br from-primary to-primary-container py-2.5 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Inscription..." : "S'inscrire"}
          </button>

          <p className="mt-2 text-center text-sm text-muted">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary-container"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
