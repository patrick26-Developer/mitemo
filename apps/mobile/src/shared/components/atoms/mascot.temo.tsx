import Svg from "react-native-svg";

import { MascotBody } from "./body.mascot";

/** Props de Temo seul. */
export interface MascotTemoProps {
  /** Largeur du dessin, en points ; la hauteur suit. */
  readonly size: number;
}

/**
 * Temo, la mascotte de Mitemo, seul et sans accessoire : pour accompagner
 * une explication. Décoratif pour les lecteurs d'écran.
 * @param props Taille du dessin.
 * @returns Temo.
 */
export function MascotTemo(props: MascotTemoProps) {
  return (
    <Svg
      testID="mascot-temo"
      width={props.size}
      height={(props.size * 200) / 220}
      viewBox="0 0 220 200"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <MascotBody />
    </Svg>
  );
}
