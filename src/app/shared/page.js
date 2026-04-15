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

    const unsubscribe = subscribeToSharedLists(
      userId,
      (nextLists) => {
        setLists(nextLists);
        setListsLoaded(true);
        setError(null);
      },
      (err) => {
        const msg = err?.message ?? String(err);
        setError(msg);
        showError(msg);
        setListsLoaded(true);
      },
    );

    return () => {
      unsubscribe();
      setLists([]);
      setListsLoaded(false);
    };
  }, [userId]);

  const activeList = lists.find((l) => l.id === activeListId) ?? null;

  useEffect(() => {
    if (!activeListId) return;

    const unsubscribe = subscribeToSharedTasks(
      activeListId,
      setTasks,
      (err) => {
        showError(err?.message ?? String(err));
      },
    );
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
        const msg = e?.message ?? String(e);
        setError(msg);
        showError(msg);
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
        showError(e?.message ?? String(e));
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
      try {
        await updateSharedTask(activeListId, taskId, updates);
      } catch (e) {
        showError(e?.message ?? String(e));
      }
    },
    [activeListId, showError],
  );

  const handleDeleteTask = useCallback(
    async (taskId) => {
      if (!activeListId) return;
      try {
        await deleteSharedTask(activeListId, taskId);
        showSuccess("Tâche supprimée avec succès.");
      } catch (e) {
        showError(e?.message ?? String(e));
      }
    },
    [activeListId, showSuccess, showError],
  );

  return (
    <AuthGuard>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-4xl">
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
              <div className="mb-6 sm:mb-8">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Listes partagées
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Collaborez avec votre équipe en temps réel
                </p>
              </div>

              <CreateListForm onCreateList={handleCreateList} />

              {error && (
                <div className="mt-6 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                    {error}
                  </div>
                </div>
              )}

              {loading ? (
                <div role="status" aria-live="polite" className="mt-6 grid gap-4 sm:grid-cols-2">
                  <span className="sr-only">Chargement des listes...</span>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5">
                      <div className="mb-3 h-5 w-2/3 rounded bg-white/5" />
                      <div className="mb-3 h-1 w-full rounded-full bg-white/5" />
                      <div className="mb-4 h-4 w-1/2 rounded bg-white/5" />
                      <div className="h-9 w-24 rounded-lg bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : lists.length === 0 ? (
                <div className="mt-12 flex flex-col items-center gap-3 py-12">
                  <span className="material-symbols-outlined text-muted/30" style={{ fontSize: 48 }}>folder_shared</span>
                  <p className="text-muted">Aucune liste partagée pour le moment.</p>
                </div>
              ) : (
                <section
                  className="mt-6 grid gap-4 sm:grid-cols-2"
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
        </div>
      </div>
    </AuthGuard>
  );
}
