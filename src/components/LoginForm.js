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
      router.replace("/");
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
      {bannerError ? (
        <div
          id="login-form-error"
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {bannerError}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        noValidate
      >
        <h1 className="mb-6 text-center text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Connexion
        </h1>

        <div className="flex flex-col gap-4">
          <div className="min-w-0 text-left">
            <label
              htmlFor="login-email"
              className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Adresse e-mail
            </label>
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
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            />
            {emailEmpty ? (
              <p
                id="login-email-hint"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
              >
                L&apos;adresse e-mail est requise.
              </p>
            ) : null}
          </div>

          <div className="min-w-0 text-left">
            <label
              htmlFor="login-password"
              className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Mot de passe
            </label>
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
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            />
            {passwordEmpty ? (
              <p
                id="login-password-hint"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
              >
                Le mot de passe est requis.
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>

          {showGoogleButton ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleSubmitting || submitting}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {googleSubmitting ? "Connexion..." : "Se connecter avec Google"}
            </button>
          ) : null}

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
