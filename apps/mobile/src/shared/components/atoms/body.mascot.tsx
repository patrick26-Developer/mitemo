import { Circle, Ellipse, G, Path } from "react-native-svg";

import { MASCOT_COLORS as C } from "../../theme/theme.mascot";
import { MascotFace } from "./face.mascot";

/** Trait des bras et des jambes de Temo, en unités du dessin. */
const LIMB = { stroke: C.goldDark, strokeWidth: 10, strokeLinecap: "round", fill: "none" } as const;

/**
 * Corps de Temo : une pièce dorée sur deux jambes et deux pieds, avec deux
 * bras et leurs mains. Il salue de la main gauche et tend la droite, où se
 * posent les accessoires de chaque page.
 * @returns Le corps, à placer dans un dessin de 220 × 200.
 */
export function MascotBody() {
  return (
    <G testID="mascot-body">
      <Ellipse cx={110} cy={190} rx={50} ry={6} fill={C.shadow} />
      <Path d="M94 164 L90 180" {...LIMB} />
      <Path d="M126 164 L130 180" {...LIMB} />
      <Ellipse cx={86} cy={182} rx={14} ry={7} fill={C.goldDark} />
      <Ellipse cx={134} cy={182} rx={14} ry={7} fill={C.goldDark} />
      <Path d="M58 108 Q36 96 40 72" {...LIMB} />
      <Circle cx={40} cy={68} r={10} fill={C.gold} stroke={C.goldDark} strokeWidth={3} />
      <Path d="M162 112 Q182 120 184 138" {...LIMB} />
      <Circle cx={184} cy={142} r={10} fill={C.gold} stroke={C.goldDark} strokeWidth={3} />
      <Circle cx={110} cy={110} r={58} fill={C.gold} />
      <Circle cx={110} cy={110} r={46} fill={C.goldLight} stroke={C.goldDark} strokeWidth={3} />
      <MascotFace />
    </G>
  );
}
