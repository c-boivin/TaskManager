"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

async function saveUserProfile(firebaseUser) {
  if (!firebaseUser) return;
  try {
    await setDoc(
      doc(db, "users", firebaseUser.uid),
      { email: firebaseUser.email ?? null },
      { merge: true },
    );
  } catch {
    // Non-blocking: profile save failure shouldn't break auth flow
  }
}

const googleProvider = new GoogleAuthProvider();

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Cette adresse e-mail est déjà utilisée.",
  "auth/invalid-email": "L'adresse e-mail n'est pas valide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
  "auth/user-not-found": "Aucun compte trouvé avec cette adresse e-mail.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
  "auth/invalid-credential": "Identifiants invalides. Vérifiez votre e-mail et mot de passe.",
  "auth/popup-closed-by-user":
    "La fenêtre de connexion a été fermée. Réessayez si vous souhaitez vous connecter.",
  "auth/cancelled-popup-request":
    "Une autre fenêtre de connexion est déjà ouverte. Fermez-la et réessayez.",
};

function mapAuthError(code) {
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return "Une erreur est survenue. Veuillez réessayer.";
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setError(null);
      setLoading(false);
      saveUserProfile(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthError = useCallback((err) => {
    const message = mapAuthError(err?.code);
    setError(message);
    return message;
  }, []);

  const signUp = useCallback(
    async (email, password) => {
      setError(null);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (e) {
        handleAuthError(e);
        throw e;
      }
    },
    [handleAuthError]
  );

  const signIn = useCallback(
    async (email, password) => {
      setError(null);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        handleAuthError(e);
        throw e;
      }
    },
    [handleAuthError]
  );

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      handleAuthError(e);
      throw e;
    }
  }, [handleAuthError]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      handleAuthError(e);
      throw e;
    }
  }, [handleAuthError]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      error,
    }),
    [user, loading, error, signUp, signIn, signInWithGoogle, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
