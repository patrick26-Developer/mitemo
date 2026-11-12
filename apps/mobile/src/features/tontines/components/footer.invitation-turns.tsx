import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";

/** Props du pied du choix des tours. */
export interface InvitationTurnsFooterProps {
  readonly onBack: () => void;
  readonly onJoin: () => void;
}

/**
 * « Retour » et « Rejoindre » côte à côte, sous le choix du nombre de tours
 * d'une invitation acceptée.
 * @param props Retour à la liste et inscription.
 * @returns Le pied de la feuille.
 */
export function InvitationTurnsFooter(props: InvitationTurnsFooterProps) {
  return (
    <SheetActionRow
      secondary={{ label: "Retour", onPress: props.onBack }}
      primary={{ label: "Rejoindre", onPress: props.onJoin }}
    />
  );
}
