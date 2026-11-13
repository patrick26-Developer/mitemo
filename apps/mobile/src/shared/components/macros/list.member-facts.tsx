import { BriefcaseBusiness, CalendarDays, Phone, UserRound } from "lucide-react-native";

import type { MemberFactKind } from "../../member/model.member-summary";
import { memberSummaryRows } from "../../member/model.member-summary";
import { useMemberStore } from "../../member/store.member";
import { FactList } from "./list.facts";

/** Icône de chaque information du membre. */
const FACT_ICONS = {
  name: UserRound,
  phone: Phone,
  occupation: BriefcaseBusiness,
  createdAt: CalendarDays,
} as const satisfies Record<MemberFactKind, unknown>;

/**
 * Informations du membre en colonne, une par ligne avec son icône et un
 * trait entre chaque ligne : le style des feuilles d'information de Mitemo.
 * @returns La liste des informations du membre.
 */
export function MemberFactList() {
  const name = useMemberStore((state) => state.name);
  const phone = useMemberStore((state) => state.phone);
  const occupation = useMemberStore((state) => state.occupation);
  const createdAt = useMemberStore((state) => state.createdAt);
  const rows = memberSummaryRows({ name, phone, occupation, createdAt });

  return (
    <FactList items={rows.map((row) => ({ id: row.kind, icon: FACT_ICONS[row.kind], ...row }))} />
  );
}
