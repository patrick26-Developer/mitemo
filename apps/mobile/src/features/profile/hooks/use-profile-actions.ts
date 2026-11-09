import { router } from "expo-router";
import { useState } from "react";

import type { ProfileActionContent } from "../model/profile-content";

/**
 * Ouvre une action du profil : l'historique part sur sa page, les autres
 * actions restent dans une feuille.
 * @returns L'action sélectionnée et les fonctions d'ouverture et de fermeture.
 */
export function useProfileActions() {
  const [selectedAction, setSelectedAction] = useState<ProfileActionContent | null>(null);

  const selectAction = (action: ProfileActionContent) => {
    if (action.id === "history") {
      router.push("/history");
      return;
    }

    setSelectedAction(action);
  };

  const closeAction = () => setSelectedAction(null);

  return { selectedAction, selectAction, closeAction };
}
