import { Circle, G, Path, Rect } from "react-native-svg";

import { MASCOT_COLORS as C } from "../model/model.mascot-colors";

/**
 * Téléphone tenu par Mito, un paiement validé à l'écran.
 * @returns Le téléphone, dans la main droite de Mito.
 */
export function MascotPhone() {
  return (
    <G testID="mascot-phone">
      <Rect x={170} y={100} width={36} height={60} rx={8} fill={C.ink} />
      <Rect x={174} y={108} width={28} height={42} rx={4} fill={C.white} />
      <Path
        d="M181 129 l5 5 l10 -11"
        stroke={C.success}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx={178} cy={142} r={9} fill={C.gold} />
    </G>
  );
}
