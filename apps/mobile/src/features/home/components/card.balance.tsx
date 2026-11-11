import { Eye, EyeOff } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BarcodeStrip } from "../../../shared/components/atoms/strip.barcode";
import { formatAmount } from "../../../shared/format/format.amount";
import { totalSaved } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { usePrivacyStore } from "../../../shared/member/store.privacy";
import { maskAmountText } from "../../../shared/model/model.amount-mask";
import { HAIRLINE_WIDTH } from "../../../shared/theme/theme.hairline-width";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Durée de l'apparition de la carte, en millisecondes. */
const ENTERING_DURATION = 500;

/**
 * Affiche le solde disponible, le montant mis de côté et le bouton qui masque
 * les montants dans un lieu public.
 * @returns La carte de solde.
 */
export function BalanceCard() {
  const available = usePortfolioStore((state) => state.available);
  const saved = usePortfolioStore((state) => totalSaved(state.cards));
  const hidden = usePrivacyStore((state) => state.amountsHidden);
  const toggle = usePrivacyStore((state) => state.toggleAmounts);
  const label = hidden ? "Afficher les montants" : "Masquer les montants";

  return (
    <Animated.View entering={FadeInDown.duration(ENTERING_DURATION)}>
      <View className="mx-4 flex-col gap-3.5 rounded-[20px] border-blue-400 border-[0.5px] bg-card p-6">
        <View className="flex-row items-center">
          <Text className="text-[14px] text-white">Solde disponible</Text>
          <View className="mx-3 flex-1 bg-on-dark-line" style={HAIRLINE} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            hitSlop={8}
            onPress={toggle}
          >
            {hidden ? (
              <EyeOff size={20} color={PALETTE.white} />
            ) : (
              <Eye size={20} color={PALETTE.white} />
            )}
          </Pressable>
        </View>

        <Text className="mb-3.5 mt-3.5 text-[32px] font-medium text-yellow-500">
          {hidden ? maskAmountText(formatAmount(available)) : formatAmount(available)}{" "}
          <Text className="font-light text-on-dark-soft text-lg">FCFA</Text>
        </Text>

        <BarcodeStrip color={PALETTE.barcodeOnBrand} />

        <View className="mt-3.5 flex-row items-center justify-between pb-2">
          <Text className="text-[16px] text-white">
            {hidden ? maskAmountText(formatAmount(saved)) : formatAmount(saved)} FCFA
          </Text>
          <Text className="text-[16px] text-white">Mis de côté</Text>
        </View>
      </View>
    </Animated.View>
  );
}

/** Filet de séparation d'un demi-point, que Tailwind n'exprime pas. */
const HAIRLINE = { height: HAIRLINE_WIDTH };
