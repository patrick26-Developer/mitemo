import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { GridBackground } from "../atoms/background.grid";

/** Hauteur du décor, en points : il couvre l'en-tête et le haut de la liste. */
const TAB_BACKGROUND_HEIGHT = 360;

/** Couleur des lignes : le bleu Mitemo, très discret sur le blanc. */
export const TAB_GRID_LINE = "rgba(17, 54, 179, 0.07)";

/** Dégradé tout blanc : transparent en haut, blanc opaque en bas. */
const FADE_COLORS = ["rgba(255, 255, 255, 0)", "#FFFFFF"] as const;

/**
 * Décor des écrans d'onglet (Tontines, Cartes, Profil) : un quadrillage
 * discret en haut de l'écran, qui se fond dans le blanc du contenu.
 * @returns Le décor, posé derrière le contenu sans capter les touchers.
 */
export function TabBackground() {
  return (
    <View
      testID="tab-background"
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, height: TAB_BACKGROUND_HEIGHT }}
    >
      <GridBackground testID="tab-background-grid" lineColor={TAB_GRID_LINE} />
      <LinearGradient
        testID="tab-background-fade"
        colors={FADE_COLORS}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </View>
  );
}
