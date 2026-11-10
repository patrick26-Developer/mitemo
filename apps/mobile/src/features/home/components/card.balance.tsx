import { ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BarcodeStrip } from "../../../shared/components/atoms/strip.barcode";
import { formatAmount } from "../../../shared/format/format.amount";
import { HAIRLINE_WIDTH } from "../../../shared/theme/theme.hairline-width";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { HOME_BALANCE } from "../model/model.home-content";

/** Durée de l'apparition de la carte, en millisecondes. */
const ENTERING_DURATION = 500;

/**
 * Affiche le solde disponible, le montant mis de côté et la mention de protection.
 * @returns La carte de solde.
 */
export function BalanceCard() {
  return (
    <Animated.View entering={FadeInDown.duration(ENTERING_DURATION)}>
      <View className="mx-4 flex-col gap-3.5 rounded-[20px] bg-card p-6">
        <View className="flex-row items-center">
          <Text className="text-[14px] text-white">Solde disponible</Text>
          <View className="mx-3 flex-1 bg-on-dark-line" style={HAIRLINE} />
          <ShieldCheck size={20} color={PALETTE.white} />
        </View>

        <Text className="mb-3.5 mt-3.5 text-[32px] font-medium text-white">
          {formatAmount(HOME_BALANCE.available)}{" "}
          <Text className="font-light text-on-dark-soft">FCFA</Text>
        </Text>

        <BarcodeStrip color={PALETTE.barcodeOnBrand} />

        <View className="mt-3.5 flex-row items-center justify-between pb-2">
          <Text className="text-[16px] text-white">{formatAmount(HOME_BALANCE.saved)} FCFA</Text>
          <Text className="text-[16px] text-white">Mis de côté</Text>
        </View>
      </View>
    </Animated.View>
  );
}

/** Filet de séparation d'un demi-point, que Tailwind n'exprime pas. */
const HAIRLINE = { height: HAIRLINE_WIDTH };
