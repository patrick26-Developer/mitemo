import { useState } from "react";
import type { CurrentUser } from "@mitemo/contracts";
import { identityApi } from "../../../shared/api/config.api";
import { useAsyncAction } from "../../../shared/hooks/hook.async-action";
import { useSessionStore } from "../../../shared/session/store.session";

function applyProfile(updated: CurrentUser, original: CurrentUser | null): void {
  const session = useSessionStore.getState();
  if (session.signedIn && session.user?.userId === original?.userId) session.signIn(updated);
}

async function closeSession(): Promise<void> {
  try {
    await identityApi.logout();
  } finally {
    useSessionStore.getState().signOut();
  }
}

async function updateProfile(name: string, user: CurrentUser | null): Promise<void> {
  applyProfile(await identityApi.updateMe({ displayName: name.trim() }), user);
}

/**
 * Modifie le nom public et révoque la session serveur à la déconnexion.
 * @returns Profil attesté, saisie et actions serveur.
 */
export function useServerProfile() {
  const user = useSessionStore((state) => state.user);
  const [name, setName] = useState(user?.displayName ?? "");
  const [message, setMessage] = useState("");
  const { pending, error, run } = useAsyncAction(() => "Modification non confirmée. Réessayez.");
  const save = () =>
    run(async () => {
      await updateProfile(name, user);
      setMessage("Nom enregistré sur le serveur.");
    });
  const logout = () => run(closeSession);
  return { user, name, setName, message: error || message, pending, save, logout };
}
