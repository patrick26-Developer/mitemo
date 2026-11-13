import { Text, View } from "react-native";

import type { FeedbackKind } from "./banner.feedback";
import { PALETTE } from "../../theme/theme.palette";

/** Couleurs du titre et de la description, selon la nature du toast. */
const TEXT_COLORS = {
  success: { title: PALETTE.ink, message: PALETTE.muted },
  error: { title: PALETTE.white, message: "rgba(255,255,255,0.88)" },
} as const;

/** Props du texte d'un toast. */
export interface ToastTextProps {
  readonly kind: FeedbackKind;
  readonly title: string;
  readonly message: string;
}

/**
 * Titre en gras, puis la description de ce qui vient de se passer.
 * @param props Nature, titre et description.
 * @returns Le texte du toast.
 */
export function ToastText(props: ToastTextProps) {
  const colors = TEXT_COLORS[props.kind];

  return (
    <View className="flex-1 gap-0.5">
      <Text className="text-[15px] font-bold" style={{ color: colors.title }}>
        {props.title}
      </Text>
      <Text className="text-[13px] leading-[18px]" style={{ color: colors.message }}>
        {props.message}
      </Text>
    </View>
  );
}
