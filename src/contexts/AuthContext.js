"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Cette adresse e-mail est déjà utilisée.",
  "auth/invalid-email": "L'adresse e-mail n'est pas valide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
  "auth/user-not-found": "Identifiants invalides. Vérifiez votre e-mail et mot de passe.",
  "auth/wrong-password": "Identifiants invalides. Vérifiez votre e-mail et mot de passe.",
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

let _firebasePromise = null;
function getFirebase() {
  if (!_firebasePromise) {
    _firebasePromise = Promise.all([
      import("firebase/auth"),
      import("firebase/firestore"),
      import("@/lib/firebase"),
    ]).then(([authMod, firestoreMod, firebaseMod]) => ({
      authMod,
      firestoreMod,
      auth: firebaseMod.auth,
      db: firebaseMod.db,
    })).catch((e) => {
      _firebasePromise = null;
      throw e;
    });
  }
  return _firebasePromise;
}

async function saveUserProfile(firebaseUser) {
  if (!firebaseUser) return;
  try {
    const { firestoreMod, db } = await getFirebase();
    await firestoreMod.setDoc(
      firestoreMod.doc(db, "users", firebaseUser.uid),
      { email: firebaseUser.email ?? null },
      { merge: true },
    );
  } catch {
    // Non-blocking: profile save failure shouldn't break auth flow
  }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const googleProviderRef = useRef(null);

  useEffect(() => {
    let unsubscribe;

    getFirebase().then(({ authMod, auth }) => {
      unsubscribe = authMod.onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setError(null);
        setLoading(false);
        saveUserProfile(currentUser);
      });
    });

    return () => unsubscribe?.();
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
        const { authMod, auth } = await getFirebase();
        await authMod.createUserWithEmailAndPassword(auth, email, password);
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
        const { authMod, auth } = await getFirebase();
        await authMod.signInWithEmailAndPassword(auth, email, password);
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
      const { authMod, auth } = await getFirebase();
      if (!googleProviderRef.current) {
        googleProviderRef.current = new authMod.GoogleAuthProvider();
      }
      await authMod.signInWithPopup(auth, googleProviderRef.current);
    } catch (e) {
      handleAuthError(e);
      throw e;
    }
  }, [handleAuthError]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const { authMod, auth } = await getFirebase();
      await authMod.signOut(auth);
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
