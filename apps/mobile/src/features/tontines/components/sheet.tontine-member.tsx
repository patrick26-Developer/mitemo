import { Hourglass } from "lucide-react-native";
import { Text, View } from "react-native";

import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { memberContributions } from "../../../shared/member/model.portfolio";
import { freeTurns } from "../../../shared/member/model.tontine-turns";
import { useMemberPhotoUri } from "../hooks/hook.member-photo";
import { turnsLabel } from "../model/model.member-turns";
import { MemberRoundItem } from "./item.member-round";
import { MemberZoomPhoto } from "./photo.member-zoom";

/** Props de la fiche d'un membre. */
export interface TontineMemberSheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  /** Membre affiché, `null` quand la feuille est fermée. */
  readonly member: TontineMember | null;
  readonly onClose: () => void;
}

/** Props de l'historique d'un membre. */
interface MemberHistoryProps {
  readonly item: Tontine;
  readonly member: TontineMember;
}

/**
 * Historique d'un membre : avant le lancement, l'attente des membres ; ensuite,
 * les tours passés, cochés quand il a cotisé.
 * @param props Tontine et membre.
 * @returns L'état d'attente ou la liste des tours.
 */
function MemberHistory(props: MemberHistoryProps) {
  const { item, member } = props;
  if (item.state === "PENDING") {
    const missing = freeTurns(item);
    const who = missing > 1 ? `${missing} membres` : `${missing} membre`;
    return (
      <EmptyState
        icon={Hourglass}
        title="Tontine en attente"
        message={`La tontine attend encore ${who} pour débuter.`}
      />
    );
  }
  const amount = `${formatAmount(item.contribution)} FCFA`;

  return (
    <View className="gap-2.5">
      {memberContributions(item, member.id).map((entry) => (
        <MemberRoundItem
          key={entry.round}
          round={entry.round}
          paid={entry.paid}
          amount={amount}
          accent={item.headerColors[0]}
        />
      ))}
    </View>
  );
}

/**
 * Fiche d'un membre : sa photo, agrandissable, son historique de cotisation
 * et son rôle.
 * @param props Visibilité, tontine, membre et fermeture.
 * @returns La fiche, ou rien quand aucun membre n'est choisi.
 */
export function TontineMemberSheet(props: TontineMemberSheetProps) {
  const { visible, item, member, onClose } = props;
  const photoUri = useMemberPhotoUri(member?.id ?? "");
  if (member === null) return null;

  return (
    <BottomSheet visible={visible} title={member.name} onClose={onClose}>
      {photoUri === null ? null : <MemberZoomPhoto photoUri={photoUri} name={member.name} />}
      <MemberHistory item={item} member={member} />
      <Text className="text-[12px] text-muted">
        {`${member.role === "ADMIN" ? "Administrateur de la tontine" : "Membre de la tontine"} · ${turnsLabel(item, member.id)}`}
      </Text>
    </BottomSheet>
  );
}
