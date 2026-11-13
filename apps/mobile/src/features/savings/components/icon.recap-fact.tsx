import { CalendarClock, CalendarPlus, PiggyBank, Users } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { FactPillIcon } from "../../../shared/components/atoms/icon.fact-pill";
import type { RecapFactKind } from "../model/model.card-recap";

/** Icône de chaque nature de ligne du récapitulatif. */
const RECAP_FACT_ICONS: Readonly<Record<RecapFactKind, LucideIcon>> = {
  remaining: PiggyBank,
  created: CalendarPlus,
  deadline: CalendarClock,
  tontine: Users,
};

/** Props de l'icône d'une ligne du récapitulatif. */
export interface RecapFactIconProps {
  readonly kind: RecapFactKind;
}

/**
 * Affiche la petite icône d'une ligne du récapitulatif dans une pastille
 * claire, posée sur la teinte de la carte.
 * @param props Nature de la ligne.
 * @returns La pastille et son icône.
 */
export function RecapFactIcon(props: RecapFactIconProps) {
  return (
    <FactPillIcon icon={RECAP_FACT_ICONS[props.kind]} testID={`recap-fact-icon-${props.kind}`} />
  );
}
