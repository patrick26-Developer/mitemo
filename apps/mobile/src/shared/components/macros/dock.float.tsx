import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeedbackBanner } from "../atoms/banner.feedback";
import type { FeedbackKind } from "../atoms/banner.feedback";
import { PressableScale } from "../atoms/scale.pressable";

/** Espace latéral de l'action flottante, en points. */
const SIDE_PADDING = 16;

/** Espace minimal sous l'action, quand la zone sûre est nulle. */
const MIN_BOTTOM_PADDING = 12;

/** Action flottante affichée en bas de l'écran. */
export interface FloatAction {
  readonly label: string;
  readonly onPress: () => void;
}

/** Retour d'opération affiché au-dessus de l'action. */
export interface FloatNotice {
  readonly kind: FeedbackKind;
  readonly message: string;
}

/** Props du dock flottant. */
export interface FloatDockProps {
  /** Action à proposer, absente quand aucune n'est possible. */
  readonly action: FloatAction | null;
  /** Dernier retour d'opération, affiché au-dessus de l'action. */
  readonly notice?: FloatNotice | null;
}

/**
 * Pose une action seule en bas de l'écran, sans fond ni barre : le contenu
 * reste visible derrière et l'action flotte au-dessus de la zone sûre.
 * @param props Action à proposer et retour d'opération.
 * @returns L'action flottante, ou rien quand elle n'a pas lieu d'être.
 */
export function FloatDock(props: FloatDockProps) {
  const { action, notice = null } = props;
  const insets = useSafeAreaInsets();

  if (action === null && notice === null) return null;

  return (
    <View
      testID="float-dock"
      className="gap-2.5"
      style={[styles.dock, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING) }]}
    >
      {notice === null ? null : <FeedbackBanner kind={notice.kind} message={notice.message} />}
      {action === null ? null : (
        <PressableScale
          accessibilityLabel={action.label}
          onPress={action.onPress}
          className="rounded-[16px]"
        >
          <Text className="py-3.5 text-center text-[16px] font-semibold text-brand">
            {action.label}
          </Text>
        </PressableScale>
      )}
    </View>
  );
}

/** Position flottante du dock, que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  dock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SIDE_PADDING,
  },
});
