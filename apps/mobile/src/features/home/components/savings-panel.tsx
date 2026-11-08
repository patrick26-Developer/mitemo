import { CalendarDays, ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";

import { BarcodeStrip } from "@/shared/components/barcode-strip";
import { formatAmount } from "@/shared/format/format-amount";
import { HAIRLINE_WIDTH } from "@/shared/theme/hairline-width";
import { PALETTE } from "@/shared/theme/palette";
import type { HomeSavings } from "./model/home-content";

/** Props du panneau de caisse. */
export interface SavingsPanelProps {
  readonly item: HomeSavings;
}

/**
 * Affiche le montant épargné, l'objectif et l'échéance d'une caisse.
 * @param props Caisse à afficher.
 * @returns Le panneau sombre de la caisse.
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
        {formatAmount(item.current)} <Text className="font-light text-on-dark-soft">FCFA</Text>
      </Text>

      <View className="mb-3 bg-on-dark-divider" style={HAIRLINE} />

      <View className="flex-row items-center justify-between pb-2">
        <Text className="text-[13px] text-white">Objectif</Text>
        <Text className="text-[13px] text-white">{formatAmount(item.goal)} FCFA</Text>
      </View>

      <BarcodeStrip color={PALETTE.barcodeOnSavings} />

      <View className="mt-2.5 flex-row items-center gap-1.5">
        <CalendarDays size={13} color={PALETTE.onDarkFaint} />
        <Text className="text-[12px] text-on-dark-faint">Jusqu&apos;au {item.until}</Text>
      </View>
    </View>
  );
}

/** Filet d'un demi-point, que Tailwind n'exprime pas. */
const HAIRLINE = { height: HAIRLINE_WIDTH };
