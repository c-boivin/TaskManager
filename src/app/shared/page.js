"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AuthContext } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import CreateListForm from "@/components/CreateListForm";
import SharedListCard from "@/components/SharedListCard";
import SharedListView from "@/components/SharedListView";
import { ToastContainer, useToast } from "@/components/Toast";
import {
  addMemberToList,
  addSharedTask,
  createSharedList,
  deleteSharedList,
  deleteSharedTask,
  removeMemberFromList,
  subscribeToSharedLists,
  subscribeToSharedTasks,
  updateSharedTask,
} from "@/services/sharedListService";

async function fetchMemberProfiles(memberIds) {
  if (!memberIds?.length) return [];

  const usersRef = collection(db, "users");
  const batches = [];
  for (let i = 0; i < memberIds.length; i += 10) {
    batches.push(memberIds.slice(i, i + 10));
  }

  const profiles = [];
  for (const batch of batches) {
    const q = query(usersRef, where("__name__", "in", batch));
    const snap = await getDocs(q);
    snap.docs.forEach((d) => {
      profiles.push({ uid: d.id, email: d.data().email ?? d.id });
    });
  }

  memberIds.forEach((id) => {
    if (!profiles.some((p) => p.uid === id)) {
      profiles.push({ uid: id, email: id });
    }
  });

  return profiles;
}

export default function SharedPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const userId = user?.uid;
  const { toasts, dismiss, success: showSuccess, error: showError } = useToast();

  const [lists, setLists] = useState([]);
  const [listsLoaded, setListsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [activeListId, setActiveListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const loading = authLoading || (!listsLoaded && !!userId);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToSharedLists(userId, (nextLists) => {
      setLists(nextLists);
      setListsLoaded(true);
      setError(null);
    });

    return () => {
      unsubscribe();
      setLists([]);
      setListsLoaded(false);
    };
  }, [userId]);

  const activeList = lists.find((l) => l.id === activeListId) ?? null;

  useEffect(() => {
    if (!activeListId) return;

    const unsubscribe = subscribeToSharedTasks(activeListId, setTasks);
    return () => {
      unsubscribe();
      setTasks([]);
    };
  }, [activeListId]);

  const memberKey = activeList?.members?.join(",") ?? "";

  useEffect(() => {
    if (!activeList) return;

    let cancelled = false;
    fetchMemberProfiles(activeList.members).then((profiles) => {
      if (!cancelled) setMembers(profiles);
    });
    return () => {
      cancelled = true;
      setMembers([]);
    };
  }, [activeList, memberKey]);

  const handleCreateList = useCallback(
    async (name) => {
      if (!userId) throw new Error("Session expirée. Veuillez vous reconnecter.");
      await createSharedList(userId, name);
      showSuccess("Liste créée avec succès.");
    },
    [userId, showSuccess],
  );

  const handleDeleteList = useCallback(
    async (listId) => {
      if (!userId) return;
      try {
        setError(null);
        await deleteSharedList(listId, userId);
        if (activeListId === listId) setActiveListId(null);
        showSuccess("Liste supprimée avec succès.");
      } catch (e) {
        setError(e?.message ?? String(e));
        showError("Impossible de supprimer la liste.");
      }
    },
    [userId, activeListId, showSuccess, showError],
  );

  const handleAddMember = useCallback(
    async (email) => {
      if (!activeListId) return;
      await addMemberToList(activeListId, email);
      showSuccess("Membre ajouté avec succès.");
    },
    [activeListId, showSuccess],
  );

  const handleRemoveMember = useCallback(
    async (memberId) => {
      if (!activeListId || !userId) return;
      try {
        await removeMemberFromList(activeListId, memberId, userId);
        showSuccess("Membre retiré avec succès.");
      } catch (e) {
        showError("Impossible de retirer ce membre.");
        throw e;
      }
    },
    [activeListId, userId, showSuccess, showError],
  );

  const handleAddTask = useCallback(
    async (task) => {
      if (!activeListId || !userId) return;
      await addSharedTask(activeListId, userId, task);
      showSuccess("Tâche ajoutée avec succès.");
    },
    [activeListId, userId, showSuccess],
  );

  const handleUpdateTask = useCallback(
    async (taskId, updates) => {
      if (!activeListId) return;
      await updateSharedTask(activeListId, taskId, updates);
    },
    [activeListId],
  );

  const handleDeleteTask = useCallback(
    async (taskId) => {
      if (!activeListId) return;
      try {
        await deleteSharedTask(activeListId, taskId);
        showSuccess("Tâche supprimée avec succès.");
      } catch (e) {
        showError("Impossible de supprimer la tâche.");
        throw e;
      }
    },
    [activeListId, showSuccess, showError],
  );

  return (
    <AuthGuard>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 py-12 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <main className="flex w-full max-w-lg flex-col items-center gap-8">
          {activeList ? (
            <SharedListView
              list={activeList}
              tasks={tasks}
              currentUserId={userId}
              members={members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onBack={() => setActiveListId(null)}
            />
          ) : (
            <>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Listes partagées
              </h1>

              <div className="w-full">
                <CreateListForm onCreateList={handleCreateList} />
              </div>

              {error && (
                <p
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {loading ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex w-full flex-col gap-4"
                >
                  <span className="sr-only">Chargement des listes...</span>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950"
                    >
                      <div className="mb-3 h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mb-3 h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                      <div className="h-9 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                  ))}
                </div>
              ) : lists.length === 0 ? (
                <p className="py-8 text-center text-zinc-700 dark:text-zinc-300">
                  Aucune liste partagée pour le moment.
                </p>
              ) : (
                <section
                  className="flex w-full flex-col gap-4"
                  aria-label="Vos listes partagées"
                >
                  {lists.map((list) => (
                    <SharedListCard
                      key={list.id}
                      list={list}
                      currentUserId={userId}
                      onOpen={setActiveListId}
                      onDelete={handleDeleteList}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
