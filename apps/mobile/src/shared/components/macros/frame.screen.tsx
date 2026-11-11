import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Espace entre la zone sûre de l'écran et son contenu, en points. */
const TOP_GAP = 12;

/** Props du cadre commun d'un écran. */
export interface ScreenFrameProps {
  readonly children: ReactNode;
}

/**
 * Pose la marge haute commune aux écrans de contenu.
 * @param props Contenu de l'écran.
 * @returns Le cadre de l'écran.
 */
export function ScreenFrame(props: ScreenFrameProps) {
  const { children } = props;
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + TOP_GAP }}>
      {children}
    </View>
  );
}
