import { withTapSound } from "../../feedback/api.tap-sound";
import { SheetPrimaryButton } from "../atoms/button.sheet-primary";
import { SheetActionRow } from "./row.sheet-actions";

/** Props du pied d'un formulaire en plusieurs étapes. */
export interface SheetStepsFooterProps {
  readonly isFirst: boolean;
  readonly isLast: boolean;
  /** Libellé de l'action de la dernière étape, par exemple « Créer la carte ». */
  readonly finalLabel: string;
  readonly onBack: () => void;
  /** Passe à l'étape suivante, ou valide le formulaire à la dernière étape. */
  readonly onNext: () => void;
}

/**
 * Actions d'un formulaire en plusieurs étapes : « Continuer » seul à la
 * première étape, puis « Retour » et l'action suivante sur une même ligne.
 * Aucun « Annuler » : la feuille se ferme déjà par son X.
 * @param props Position dans les étapes, libellé final et actions.
 * @returns Le pied du formulaire.
 */
export function SheetStepsFooter(props: SheetStepsFooterProps) {
  const { isFirst, isLast, finalLabel, onBack, onNext } = props;
  const nextLabel = isLast ? finalLabel : "Continuer";
  const next = withTapSound("add", onNext);

  if (isFirst) return <SheetPrimaryButton label={nextLabel} onPress={next} />;

  return (
    <SheetActionRow
      secondary={{ label: "Retour", onPress: onBack }}
      primary={{ label: nextLabel, onPress: next }}
    />
  );
}
