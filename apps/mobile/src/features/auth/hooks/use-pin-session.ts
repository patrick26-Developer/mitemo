import { router } from "expo-router";
import { useCallback, useEffect } from "react";

import { useMemberStore } from "../../../shared/member/member-store";
import { useAuthDraft } from "../model/auth-draft";

/**
 * Prépare la fin du parcours : enregistre l'identité d'une inscription,
 * efface le brouillon et ouvre l'application.
 * @returns Le mode, l'action de réussite, le retour et l'absence de brouillon.
 */
export function usePinSession() {
  const { mode, name, phone, reset } = useAuthDraft();
  const updateIdentity = useMemberStore((state) => state.updateIdentity);
  const isSignUp = mode === "sign-up";
  const missingDraft = phone === "";

  const complete = useCallback(() => {
    if (isSignUp) {
      updateIdentity({ name, phone });
    }

    reset();
    router.replace("/(tabs)");
  }, [isSignUp, name, phone, reset, updateIdentity]);

  const back = useCallback(() => router.back(), []);

  useEffect(() => {
    // Contrôle à la seule ouverture : la réussite vide le brouillon, et une
    // vérification continue annulerait l'ouverture des onglets.
    if (useAuthDraft.getState().phone === "") {
      router.replace("/(auth)/sign-in");
    }
  }, []);

  return { isSignUp, complete, back, missingDraft };
}
