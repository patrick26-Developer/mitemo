import { Text } from "react-native";

import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { memberContributions } from "../../../shared/member/model.portfolio";
import { turnsLabel } from "../model/model.member-turns";

/** Props de la feuille d'historique d'un membre. */
export interface TontineMemberSheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  /** Membre affiché, `null` quand la feuille est fermée. */
  readonly member: TontineMember | null;
  readonly onClose: () => void;
}

/**
 * Construit les lignes de l'historique d'un membre.
 * @param item Tontine concernée.
 * @param member Membre affiché.
 * @returns Les tours et l'état de leur cotisation.
 */
function historyRows(item: Tontine, member: TontineMember): readonly SheetRecapRow[] {
  return memberContributions(item, member.id).map((entry) => ({
    label: `Tour ${entry.round}`,
    value: `${formatAmount(item.contribution)} FCFA · ${entry.paid ? "Réglé" : "En attente"}`,
  }));
}

/**
 * Affiche l'historique de cotisation d'un membre dans une feuille, ouvert
 * depuis la liste des membres du tour, avec son rôle et ses tours de passage.
 * @param props Visibilité, tontine, membre et fermeture.
 * @returns La feuille d'historique, ou rien sans membre choisi.
 */
export function TontineMemberSheet(props: TontineMemberSheetProps) {
  const { visible, item, member, onClose } = props;
  if (member === null) return null;
  const rows = historyRows(item, member);

  return (
    <BottomSheet visible={visible} title={member.name} onClose={onClose}>
      <Text className="text-[14px] leading-5 text-muted">
        Cotisations de ce membre, tour par tour.
      </Text>
      {rows.length === 0 ? (
        <Text className="text-[14px] text-muted">
          Aucune cotisation enregistrée pour le moment.
        </Text>
      ) : (
        <SheetRecap title="Historique des cotisations" rows={rows} />
      )}
      <Text className="text-[12px] text-muted">
        {`${member.role === "ADMIN" ? "Administrateur de la tontine" : "Membre de la tontine"} · ${turnsLabel(item, member.id)}`}
      </Text>
    </BottomSheet>
  );
}
