import { Text, View } from "react-native";

/** Nature d'un message de retour : opération réussie ou refusée. */
export const FEEDBACK_KINDS = ["success", "error"] as const;

/** Nature d'un message de retour. Voir {@link FEEDBACK_KINDS}. */
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

/** Classes de chaque nature de message. */
const KIND_CLASSES: Readonly<Record<FeedbackKind, string>> = {
  success: "border-[#1F8A4C] bg-[#E7F6ED]",
  error: "border-danger bg-[#FDECEA]",
};

/** Props d'un bandeau de retour d'opération. */
export interface FeedbackBannerProps {
  readonly kind: FeedbackKind;
  readonly message: string;
}

/**
 * Affiche le résultat d'une opération, en vert si elle a réussi, en rouge sinon.
 * @param props Nature et message du retour.
 * @returns Le bandeau de retour.
 */
export function FeedbackBanner(props: FeedbackBannerProps) {
  const { kind, message } = props;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={`rounded-[14px] border px-4 py-3 ${KIND_CLASSES[kind]}`}
    >
      <Text className="text-[13px] leading-5 text-ink">{message}</Text>
    </View>
  );
}
