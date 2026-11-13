import { StyleSheet, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { MITEMO_LOGO } from "../../../shared/model/model.mitemo-logo";
import { PALETTE } from "../../../shared/theme/theme.palette";
import {
  LOGO_SHAPE_ENTER_MS,
  LOGO_SHAPE_FRAMES,
  logoShapeDelay,
} from "../model/model.splash-motion";

/** Courbe d'entrée des formes : départ vif, arrivée amortie. */
const SHAPE_EASING = Easing.bezier(0.22, 1, 0.36, 1);

/** Props du logo animé du lancement. */
export interface SplashLogoProps {
  /** Largeur du logo, en points. */
  readonly width: number;
}

/**
 * Logo du lancement, dessiné forme par forme : chaque forme est posée sur
 * la même boîte que le logo fixe, puis entre à son tour.
 * @param props Largeur du logo.
 * @returns Le logo animé.
 */
export function SplashLogo(props: SplashLogoProps) {
  const size = {
    width: props.width,
    height: (props.width * MITEMO_LOGO.height) / MITEMO_LOGO.width,
  };
  const viewBox = `0 0 ${MITEMO_LOGO.width} ${MITEMO_LOGO.height}`;

  return (
    <View testID="mitemo-logo" style={size}>
      {MITEMO_LOGO.shapes.map((shape, index) => (
        <Animated.View
          key={shape}
          testID={`mitemo-logo-shape-${index}`}
          entering={new Keyframe({
            ...LOGO_SHAPE_FRAMES,
            100: { ...LOGO_SHAPE_FRAMES[100], easing: SHAPE_EASING },
          })
            .duration(LOGO_SHAPE_ENTER_MS)
            .delay(logoShapeDelay(index))}
          style={StyleSheet.absoluteFill}
        >
          <Svg width={size.width} height={size.height} viewBox={viewBox} fill="none">
            <Path d={shape} fill={PALETTE.white} />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
