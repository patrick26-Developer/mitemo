import { StyleSheet } from "react-native";
import Svg, { Defs, Pattern, Rect } from "react-native-svg";

import { NOISE_TILE_SIZE, noiseDots } from "../../model/model.noise";

/** Grains de la tuile, tirés une fois pour toute l'application. */
const DOTS = noiseDots(13);

/**
 * Pose un grain de bruit discret sur tout son parent : des points clairs et
 * sombres à peine visibles, qui texturent un fond sans changer sa couleur. Le
 * parent doit masquer ce qui déborde (`overflow-hidden`) pour garder ses coins.
 * @returns Le motif de bruit, qui laisse passer les touchers.
 */
export function NoisePattern() {
  return (
    <Svg testID="noise-pattern" pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern
          id="noise"
          patternUnits="userSpaceOnUse"
          width={NOISE_TILE_SIZE}
          height={NOISE_TILE_SIZE}
        >
          {DOTS.map((dot, index) => (
            <Rect
              key={index}
              x={dot.x}
              y={dot.y}
              width={1}
              height={1}
              fill={dot.color}
              opacity={dot.opacity}
            />
          ))}
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#noise)" />
    </Svg>
  );
}
