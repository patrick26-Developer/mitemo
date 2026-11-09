import { AlertCircle } from "lucide-react-native";
import { Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/palette";

/** Props du message d'échec de la feuille photo. */
export interface PhotoSheetErrorProps {
  readonly message: string;
}

/**
 * Affiche un échec de changement de photo sans fermer la feuille.
 * @param props Message expliquant l'échec.
 * @returns Le bandeau d'erreur.
 */
export function PhotoSheetError(props: PhotoSheetErrorProps) {
  const { message } = props;

  return (
    <View
      accessible
      accessibilityRole="alert"
      className="flex-row items-start gap-2 rounded-[14px] border border-danger/30 bg-danger/5 px-4 py-3"
    >
      <AlertCircle size={18} color={PALETTE.danger} />
      <Text className="flex-1 text-[13px] leading-5 text-danger">{message}</Text>
    </View>
  );
}
