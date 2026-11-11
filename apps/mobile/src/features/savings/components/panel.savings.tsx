import { CalendarDays, ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";

import { MarkerProgress } from "../../../shared/components/atoms/markers.progress";
import { BarcodeStrip } from "../../../shared/components/atoms/strip.barcode";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardGoal, markerFill, markersDone } from "../../../shared/member/model.portfolio";
import { HAIRLINE_WIDTH } from "../../../shared/theme/theme.hairline-width";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props du panneau de carte. */
export interface SavingsPanelProps {
  readonly item: SavingsCard;
}

/**
 * Affiche le montant épargné, l'objectif, les marqueurs et l'échéance d'une carte.
 * @param props Carte à afficher.
 * @returns Le panneau sombre de la carte.
 */
export function SavingsPanel(props: SavingsPanelProps) {
  const { item } = props;

  return (
    <View className="flex-col gap-3 rounded-[18px] border border-savings-border bg-card p-4">
      <View className="flex-row items-center">
        <Text className="text-[14px] text-white">Montant actuel</Text>
        <View className="mx-3 flex-1 bg-on-dark-line" style={HAIRLINE} />
        <ShieldCheck size={20} color={PALETTE.white} />
      </View>

      <Text className="my-3 text-[32px] font-medium text-white">
        {formatAmount(item.saved)} <Text className="font-light text-on-dark-soft">FCFA</Text>
      </Text>

      <View className="mb-3 bg-on-dark-divider" style={HAIRLINE} />

      <View className="flex-row items-center justify-between pb-2">
        <Text className="text-[13px] text-white">Objectif</Text>
        <Text className="text-[13px] text-white">{formatAmount(cardGoal(item))} FCFA</Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-[13px] text-white">Marqueurs</Text>
        <Text className="text-[13px] text-white">
          {markersDone(item)} / {item.markersTotal}
        </Text>
      </View>

      <MarkerProgress
        done={markersDone(item)}
        total={item.markersTotal}
        partial={markerFill(item)}
        accent={item.tint}
      />
      <BarcodeStrip color={PALETTE.barcodeOnSavings} />

      <View className="mt-2.5 flex-row items-center gap-1.5">
        <CalendarDays size={13} color={PALETTE.onDarkFaint} />
        <Text className="text-[12px] text-on-dark-faint">
          Jusqu&apos;au {formatLongDate(item.deadline)}
        </Text>
      </View>
    </View>
  );
}

/** Filet d'un demi-point, que Tailwind n'exprime pas. */
const HAIRLINE = { height: HAIRLINE_WIDTH };
