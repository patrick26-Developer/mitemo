import { ActivityIndicator, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props de l'attente d'une validation Mobile Money. */
export interface PayPendingStepProps {
  /** Nom de l'opérateur, par exemple « MTN MoMo ». */
  readonly operator: string;
  readonly instructions: readonly string[];
  /** Couleur d'action de l'écran d'origine, pour l'indicateur d'attente. */
  readonly accent: string;
}

/**
 * Montre que le paiement attend la confirmation de l'opérateur, transmise par
 * le serveur, et explique pas à pas comment valider sur le téléphone.
 * @param props Opérateur, instructions et couleur d'action.
 * @returns L'étape d'attente.
 */
export function PayPendingStep(props: PayPendingStepProps) {
  const { operator, instructions, accent } = props;

  return (
    <View className="gap-4">
      <View className="items-center gap-3 py-2">
        <ActivityIndicator size="large" color={accent} />
        <Text accessibilityRole="header" className="text-[17px] font-semibold text-ink">
          En attente de validation {operator}
        </Text>
        <Text className="text-center text-[13px] leading-5 text-muted">
          Gardez cette page ouverte : elle se met à jour dès que {operator} confirme le paiement.
        </Text>
      </View>
      <View className="gap-3 rounded-[16px] border border-card-border bg-white p-4">
        {instructions.map((line, index) => (
          <View key={line} className="flex-row gap-3">
            <Text className="w-5 text-[14px] font-semibold text-ink">{index + 1}.</Text>
            <Text className="flex-1 text-[14px] leading-5 text-muted">{line}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Couleur de l'indicateur quand l'écran n'a pas de couleur d'action. */
export const DEFAULT_PENDING_ACCENT = PALETTE.brand;
