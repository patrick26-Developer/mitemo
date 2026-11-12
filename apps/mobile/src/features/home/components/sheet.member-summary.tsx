import { BriefcaseBusiness, CalendarDays, Phone, UserRound } from "lucide-react-native";

import { FactList } from "../../../shared/components/macros/list.facts";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { useMemberStore } from "../../../shared/member/store.member";
import type { MemberFactKind } from "../model/model.member-summary";
import { memberSummaryRows } from "../model/model.member-summary";
import { ProfileLinkCard } from "./card.profile-link";

/** Icône de chaque information du membre. */
const FACT_ICONS = {
  name: UserRound,
  phone: Phone,
  occupation: BriefcaseBusiness,
  createdAt: CalendarDays,
} as const satisfies Record<MemberFactKind, unknown>;

/** Props de la feuille du résumé du membre. */
export interface MemberSummarySheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  /** Mène à la page profil, où le membre peut tout modifier. */
  readonly onOpenProfile: () => void;
}

/**
 * Résume l'identité du membre en colonne, une information par ligne avec son
 * icône et un trait entre chaque ligne, puis une carte fléchée qui mène à la
 * page profil.
 * @param props Visibilité, fermeture et ouverture du profil.
 * @returns La feuille du résumé du membre.
 */
export function MemberSummarySheet(props: MemberSummarySheetProps) {
  const { visible, onClose, onOpenProfile } = props;
  const name = useMemberStore((state) => state.name);
  const phone = useMemberStore((state) => state.phone);
  const occupation = useMemberStore((state) => state.occupation);
  const createdAt = useMemberStore((state) => state.createdAt);
  const rows = memberSummaryRows({ name, phone, occupation, createdAt });

  return (
    <BottomSheet visible={visible} title="Mes informations" onClose={onClose}>
      <FactList items={rows.map((row) => ({ id: row.kind, icon: FACT_ICONS[row.kind], ...row }))} />
      <ProfileLinkCard onPress={onOpenProfile} />
    </BottomSheet>
  );
}
