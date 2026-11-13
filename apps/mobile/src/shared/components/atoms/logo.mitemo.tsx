import Svg, { Path } from "react-native-svg";

import { MITEMO_LOGO } from "../../model/model.mitemo-logo";
import { PALETTE } from "../../theme/theme.palette";

/** Props du logo Mitemo. */
export interface MitemoLogoProps {
  /** Largeur du logo, en points. */
  readonly width?: number;
  /** Couleur des trois formes du logo. */
  readonly color?: string;
}

/**
 * Affiche le logo Mitemo, blanc par défaut pour les fonds bleus de
 * l'authentification, du lancement et de la présentation.
 * @param props Largeur et couleur du logo.
 * @returns Le logo vectoriel.
 */
export function MitemoLogo(props: MitemoLogoProps) {
  const { width = 130, color = PALETTE.white } = props;
  const height = (width * MITEMO_LOGO.height) / MITEMO_LOGO.width;
  const viewBox = `0 0 ${MITEMO_LOGO.width} ${MITEMO_LOGO.height}`;

  return (
    <Svg testID="mitemo-logo" width={width} height={height} viewBox={viewBox} fill="none">
      {MITEMO_LOGO.shapes.map((shape) => (
        <Path key={shape} d={shape} fill={color} />
      ))}
    </Svg>
  );
}
