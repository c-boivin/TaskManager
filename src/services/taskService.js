import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

function tasksCollection(userId) {
  return collection(db, "users", userId, "tasks");
}

function requireUserId(userId) {
  if (userId == null || String(userId).trim() === "") {
    throw new Error(
      "Identifiant utilisateur invalide : userId est requis et ne peut pas être vide."
    );
  }
}

function requireTaskId(taskId) {
  if (taskId == null || String(taskId).trim() === "") {
    throw new Error(
      "Identifiant de tâche invalide : taskId est requis et ne peut pas être vide."
    );
  }
}

function wrapFirestoreError(prefix, error) {
  const msg = error?.message ?? String(error);
  const wrapped = new Error(`${prefix} : ${msg}`);
  wrapped.cause = error;
  return wrapped;
}

function omitUndefined(updates) {
  if (updates == null || typeof updates !== "object" || Array.isArray(updates)) {
    throw new Error(
      "Le paramètre updates doit être un objet plain (pas un tableau ni null)."
    );
  }
  return Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined)
  );
}

function mapDocToTask(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title ?? "",
    completed: Boolean(data.completed),
    priority: data.priority ?? "medium",
    createdAt: data.createdAt ?? null,
  };
}

export async function getUserTasks(userId) {
  requireUserId(userId);
  try {
    const q = query(tasksCollection(userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToTask);
  } catch (error) {
    throw wrapFirestoreError(
      `Échec de la lecture des tâches (users/${userId}/tasks)`,
      error
    );
  }
}

export async function addTask(userId, task) {
  requireUserId(userId);
  const title = task?.title?.trim();
  if (!title) {
    throw new Error(
      "Titre de tâche invalide : le titre est requis et ne peut pas être vide."
    );
  }
  try {
    await addDoc(tasksCollection(userId), {
      title,
      completed: false,
      priority: task.priority ?? "medium",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw wrapFirestoreError(
      `Échec de l'ajout de la tâche (users/${userId}/tasks)`,
      error
    );
  }
}

export async function updateTask(userId, taskId, updates) {
  requireUserId(userId);
  requireTaskId(taskId);
  const payload = omitUndefined(updates);
  if (Object.keys(payload).length === 0) {
    throw new Error(
      "Aucun champ à mettre à jour : tous les champs sont undefined ou l'objet est vide."
    );
  }
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, payload);
  } catch (error) {
    throw wrapFirestoreError(
      `Échec de la mise à jour de la tâche ${taskId}`,
      error
    );
  }
}

export async function deleteTask(userId, taskId) {
  requireUserId(userId);
  requireTaskId(taskId);
  try {
    await deleteDoc(doc(db, "users", userId, "tasks", taskId));
  } catch (error) {
    throw wrapFirestoreError(
      `Échec de la suppression de la tâche ${taskId}`,
      error
    );
  }
}

export function subscribeToTasks(userId, callback, onError) {
  requireUserId(userId);
  try {
    const q = query(tasksCollection(userId), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map(mapDocToTask));
      },
      (error) => {
        console.error(
          `[subscribeToTasks] Erreur d'écoute Firestore pour l'utilisateur "${userId}" : ${error.message}`
        );
        onError?.(error);
      }
    );
  } catch (error) {
    throw wrapFirestoreError(
      `Impossible de démarrer l'écoute des tâches (users/${userId}/tasks)`,
      error
    );
  }
}
