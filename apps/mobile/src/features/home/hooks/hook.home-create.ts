import { useState } from "react";

/** Ce que l'on peut créer depuis l'accueil vide. */
export type HomeCreateKind = "tontine" | "card";

/** État de la création depuis l'accueil vide. */
export interface HomeCreateState {
  /** Vrai quand les deux choix sont dépliés sous « Créer ». */
  readonly choosing: boolean;
  /** Formulaire ouvert, ou `null`. */
  readonly form: HomeCreateKind | null;
  readonly toggleChoices: () => void;
  readonly choose: (kind: HomeCreateKind) => void;
  readonly closeForm: () => void;
}

/**
 * Création depuis l'accueil vide : « Créer » déplie deux choix, et chaque
 * choix ouvre le formulaire qui lui correspond.
 * @returns Les choix, le formulaire ouvert et leurs commandes.
 */
export function useHomeCreate(): HomeCreateState {
  const [choosing, setChoosing] = useState(false);
  const [form, setForm] = useState<HomeCreateKind | null>(null);

  return {
    choosing,
    form,
    toggleChoices: () => setChoosing((current) => !current),
    choose: (kind) => {
      setChoosing(false);
      setForm(kind);
    },
    closeForm: () => setForm(null),
  };
}
