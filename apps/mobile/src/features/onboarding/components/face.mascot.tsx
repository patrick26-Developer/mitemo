import { Circle, Ellipse, G, Path } from "react-native-svg";

import { MASCOT_COLORS as C } from "../model/model.mascot-colors";

/**
 * Visage de Mito : de grands yeux brillants, des joues roses et un sourire.
 * @returns Le visage, centré sur le corps.
 */
export function MascotFace() {
  return (
    <G>
      <Ellipse cx={92} cy={100} rx={9} ry={11} fill={C.white} />
      <Ellipse cx={128} cy={100} rx={9} ry={11} fill={C.white} />
      <Circle cx={94} cy={102} r={5} fill={C.ink} />
      <Circle cx={130} cy={102} r={5} fill={C.ink} />
      <Circle cx={95.5} cy={100} r={1.8} fill={C.white} />
      <Circle cx={131.5} cy={100} r={1.8} fill={C.white} />
      <Ellipse cx={80} cy={120} rx={7} ry={4.5} fill={C.cheek} opacity={0.6} />
      <Ellipse cx={140} cy={120} rx={7} ry={4.5} fill={C.cheek} opacity={0.6} />
      <Path
        d="M96 122 Q110 136 124 122"
        stroke={C.ink}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}
