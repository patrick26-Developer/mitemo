import { Ellipse, G, Path } from "react-native-svg";

import { MASCOT_COLORS as C } from "../model/model.mascot-colors";

/** Hauteur de chaque pièce de la pile, du bas vers le haut. */
const COIN_LEVELS = [176, 164, 152, 140] as const;

/**
 * Pile de pièces qui grandit à côté de Mito, surmontée d'une étincelle.
 * @returns La pile de pièces.
 */
export function MascotCoins() {
  return (
    <G testID="mascot-coins">
      {COIN_LEVELS.map((cy) => (
        <Ellipse
          key={cy}
          cx={190}
          cy={cy}
          rx={20}
          ry={7}
          fill={C.gold}
          stroke={C.goldDark}
          strokeWidth={2}
        />
      ))}
      <Path d="M196 112 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill={C.goldLight} />
    </G>
  );
}
