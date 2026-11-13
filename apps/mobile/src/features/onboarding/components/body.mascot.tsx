import { Circle, Ellipse, G, Path } from "react-native-svg";

import { MASCOT_COLORS as C } from "../model/model.mascot-colors";
import { MascotFace } from "./face.mascot";

/**
 * Corps de Temo : une pièce dorée sur ses deux pieds, qui salue de la main
 * gauche et tend la droite, où se posent les accessoires de chaque page.
 * @returns Le corps, à placer dans un dessin de 220 × 200.
 */
export function MascotBody() {
  return (
    <G testID="mascot-body">
      <Ellipse cx={110} cy={188} rx={50} ry={7} fill={C.shadow} />
      <Ellipse cx={92} cy={176} rx={13} ry={8} fill={C.goldDark} />
      <Ellipse cx={128} cy={176} rx={13} ry={8} fill={C.goldDark} />
      <Path
        d="M58 112 Q38 98 42 78"
        stroke={C.goldDark}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={42} cy={76} r={9} fill={C.gold} />
      <Path
        d="M162 114 Q180 122 182 136"
        stroke={C.goldDark}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={110} cy={110} r={58} fill={C.gold} />
      <Circle cx={110} cy={110} r={46} fill={C.goldLight} stroke={C.goldDark} strokeWidth={3} />
      <MascotFace />
    </G>
  );
}
