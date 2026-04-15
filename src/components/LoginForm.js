"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function fieldsInvalidForCode(code) {
  if (!code) return { email: false, password: false };
  if (code === "auth/invalid-email" || code === "auth/user-not-found") {
    return { email: true, password: false };
  }
  if (code === "auth/wrong-password") {
    return { email: false, password: true };
  }
  if (code === "auth/invalid-credential") {
    return { email: true, password: true };
  }
  return { email: false, password: false };
}

export default function LoginForm({ showGoogleButton = true }) {
  const { signIn, signInWithGoogle, error, user } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [authErrorCode, setAuthErrorCode] = useState(null);

  useEffect(() => {
    if (user) {
      router.replace("/tasks");
    }
  }, [user, router]);

  const emailEmpty = touched && !email.trim();
  const passwordEmpty = touched && !password.length;

  const { email: authEmailInvalid, password: authPasswordInvalid } =
    fieldsInvalidForCode(authErrorCode);

  const emailInvalid = emailEmpty || authEmailInvalid;
  const passwordInvalid = passwordEmpty || authPasswordInvalid;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    setAuthErrorCode(null);
    if (!email.trim() || !password) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setAuthErrorCode(err?.code ?? null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setAuthErrorCode(null);
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthErrorCode(err?.code ?? null);
    } finally {
      setGoogleSubmitting(false);
    }
  }

  function onEmailChange(v) {
    setEmail(v);
    if (authErrorCode) setAuthErrorCode(null);
  }

  function onPasswordChange(v) {
    setPassword(v);
    if (authErrorCode) setAuthErrorCode(null);
  }

  const bannerError = error;

  const emailDescribedBy = [
    emailEmpty ? "login-email-hint" : null,
    authEmailInvalid && bannerError ? "login-form-error" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const passwordDescribedBy = [
    passwordEmpty ? "login-password-hint" : null,
    authPasswordInvalid && bannerError ? "login-form-error" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full max-w-md">
      {bannerError && (
        <div
          id="login-form-error"
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
            <span className="material-symbols-outlined text-surface" style={{ fontSize: 24 }}>task_alt</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Connexion
          </h1>
          <p className="text-sm text-muted">Accédez à votre espace TaskManager</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Adresse e-mail
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
              </span>
              <input
                id="login-email"
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
              <p id="login-email-hint" className="mt-1.5 text-xs text-error">
                L&apos;adresse e-mail est requise.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
              </span>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Votre mot de passe"
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
              <p id="login-password-hint" className="mt-1.5 text-xs text-error">
                Le mot de passe est requis.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-lg bg-gradient-to-br from-primary to-primary-container py-2.5 text-sm font-semibold text-surface transition-all duration-150 hover:shadow-lg hover:shadow-primary-container/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>

          {showGoogleButton && (
            <>
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted">ou</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleSubmitting || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white/5 py-2.5 text-sm font-medium text-foreground transition-all duration-150 hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.41l3.66-2.84-.01-.48z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleSubmitting ? "Connexion..." : "Continuer avec Google"}
              </button>
            </>
          )}

          <p className="mt-2 text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary transition-colors hover:text-primary-container"
            >
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
