import { db } from "@/lib/firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const sharedListsRef = collection(db, "sharedLists");

function sharedTasksRef(listId) {
  return collection(db, "sharedLists", listId, "tasks");
}

function wrapFirestoreError(prefix, error) {
  const msg = error?.message ?? String(error);
  const wrapped = new Error(`${prefix} : ${msg}`);
  wrapped.cause = error;
  return wrapped;
}

// ---------------------------------------------------------------------------
// Shared lists
// ---------------------------------------------------------------------------

export async function createSharedList(userId, name) {
  if (!userId) throw new Error("userId est requis.");
  const trimmed = name?.trim();
  if (!trimmed) throw new Error("Le nom de la liste est requis.");

  try {
    const docRef = await addDoc(sharedListsRef, {
      name: trimmed,
      ownerId: userId,
      members: [userId],
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw wrapFirestoreError("Échec de la création de la liste partagée", error);
  }
}

export async function getUserSharedLists(userId) {
  if (!userId) throw new Error("userId est requis.");

  try {
    const q = query(sharedListsRef, where("members", "array-contains", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      name: d.data().name,
      ownerId: d.data().ownerId,
      members: d.data().members,
      createdAt: d.data().createdAt ?? null,
    }));
  } catch (error) {
    throw wrapFirestoreError("Échec de la récupération des listes partagées", error);
  }
}

export function subscribeToSharedLists(userId, callback) {
  if (!userId) throw new Error("userId est requis.");

  const q = query(sharedListsRef, where("members", "array-contains", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          ownerId: d.data().ownerId,
          members: d.data().members,
          createdAt: d.data().createdAt ?? null,
        }))
      );
    },
    (error) => {
      console.error(
        `[subscribeToSharedLists] Erreur d'écoute Firestore : ${error.message}`
      );
    }
  );
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export async function addMemberToList(listId, email) {
  if (!listId) throw new Error("listId est requis.");
  if (!email?.trim()) throw new Error("L'email est requis.");

  try {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email.trim())
    );
    const usersSnap = await getDocs(usersQuery);

    if (usersSnap.empty) {
      throw new Error(`Aucun utilisateur trouvé avec l'email : ${email}`);
    }

    const targetUserId = usersSnap.docs[0].id;
    const listRef = doc(db, "sharedLists", listId);
    await updateDoc(listRef, { members: arrayUnion(targetUserId) });

    return targetUserId;
  } catch (error) {
    if (error.message.startsWith("Aucun utilisateur")) throw error;
    throw wrapFirestoreError("Échec de l'ajout du membre", error);
  }
}

export async function removeMemberFromList(listId, userId, requestingUserId) {
  if (!listId) throw new Error("listId est requis.");
  if (!userId) throw new Error("userId est requis.");
  if (!requestingUserId) throw new Error("requestingUserId est requis.");

  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);

    if (!listSnap.exists()) {
      throw new Error("Liste partagée introuvable.");
    }
    if (listSnap.data().ownerId !== requestingUserId) {
      throw new Error("Seul le propriétaire peut retirer un membre.");
    }

    await updateDoc(listRef, { members: arrayRemove(userId) });
  } catch (error) {
    if (
      error.message === "Liste partagée introuvable." ||
      error.message === "Seul le propriétaire peut retirer un membre."
    ) {
      throw error;
    }
    throw wrapFirestoreError("Échec du retrait du membre", error);
  }
}

export async function deleteSharedList(listId, userId) {
  if (!listId) throw new Error("listId est requis.");
  if (!userId) throw new Error("userId est requis.");

  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);

    if (!listSnap.exists()) {
      throw new Error("Liste partagée introuvable.");
    }
    if (listSnap.data().ownerId !== userId) {
      throw new Error("Seul le propriétaire peut supprimer cette liste.");
    }

    const tasksSnap = await getDocs(sharedTasksRef(listId));
    const deletions = tasksSnap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletions);

    await deleteDoc(listRef);
  } catch (error) {
    if (
      error.message === "Liste partagée introuvable." ||
      error.message === "Seul le propriétaire peut supprimer cette liste."
    ) {
      throw error;
    }
    throw wrapFirestoreError("Échec de la suppression de la liste partagée", error);
  }
}

// ---------------------------------------------------------------------------
// Shared tasks
// ---------------------------------------------------------------------------

export async function getSharedListTasks(listId) {
  if (!listId) throw new Error("listId est requis.");

  try {
    const q = query(sharedTasksRef(listId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    throw wrapFirestoreError("Échec de la récupération des tâches partagées", error);
  }
}

export async function addSharedTask(listId, userId, task) {
  if (!listId) throw new Error("listId est requis.");
  if (!userId) throw new Error("userId est requis.");
  const title = task?.title?.trim();
  if (!title) throw new Error("Le titre de la tâche est requis.");

  try {
    const docRef = await addDoc(sharedTasksRef(listId), {
      title,
      description: task.description?.trim() ?? "",
      completed: false,
      priority: task.priority ?? "medium",
      createdAt: serverTimestamp(),
      addedBy: userId,
    });
    return docRef.id;
  } catch (error) {
    throw wrapFirestoreError("Échec de l'ajout de la tâche partagée", error);
  }
}

export async function updateSharedTask(listId, taskId, updates) {
  if (!listId) throw new Error("listId est requis.");
  if (!taskId) throw new Error("taskId est requis.");
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    throw new Error("Le paramètre updates doit être un objet.");
  }

  const payload = Object.fromEntries(
    Object.entries(updates).filter(([, v]) => v !== undefined)
  );
  if (Object.keys(payload).length === 0) {
    throw new Error("Aucun champ à mettre à jour.");
  }

  try {
    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await updateDoc(taskRef, payload);
  } catch (error) {
    throw wrapFirestoreError(`Échec de la mise à jour de la tâche ${taskId}`, error);
  }
}

export async function deleteSharedTask(listId, taskId) {
  if (!listId) throw new Error("listId est requis.");
  if (!taskId) throw new Error("taskId est requis.");

  try {
    await deleteDoc(doc(db, "sharedLists", listId, "tasks", taskId));
  } catch (error) {
    throw wrapFirestoreError(`Échec de la suppression de la tâche ${taskId}`, error);
  }
}

export function subscribeToSharedTasks(listId, callback) {
  if (!listId) throw new Error("listId est requis.");

  const q = query(sharedTasksRef(listId), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    },
    (error) => {
      console.error(
        `[subscribeToSharedTasks] Erreur d'écoute Firestore : ${error.message}`
      );
    }
  );
}
