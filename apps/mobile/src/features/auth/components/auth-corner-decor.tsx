import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

import { AUTH_COLORS } from "../model/auth-theme";

/** Côté sur lequel poser la décoration. */
export type AuthCornerSide = "left" | "right";

/** Props de la décoration de coin. */
export interface AuthCornerDecorProps {
  readonly side: AuthCornerSide;
}

/**
 * Affiche les formes filaires décoratives du fond bleu, dans un coin.
 * @param props Côté de l'écran sur lequel poser la décoration.
 * @returns La décoration vectorielle.
 */
export function AuthCornerDecor(props: AuthCornerDecorProps) {
  const { side } = props;
  const window = useWindowDimensions();
  const width = window.width * 0.325;
  const height = (width * 332) / 143;
  const position = side === "left" ? { left: 0 } : { right: 0, transform: [{ scaleX: -1 }] };

  return (
    <View
      pointerEvents="none"
      testID={`auth-corner-${side}`}
      style={[styles.decor, { top: window.height * 0.15, width, height }, position]}
    >
      <Svg width={width} height={height} viewBox="0 0 143 332" fill="none">
        <Path
          d="M28.3917 50.7162L56.4761 66.9307C105.084 94.9942 124.264 147.835 98.3831 192.661C87.4695 211.564 71.6339 224.025 56.9845 230.69C76.4232 190.785 61.7469 151.346 21.2407 127.96L-6.84368 111.746C-14.9367 107.073 -20.8421 99.3771 -23.2608 90.3505C-25.6794 81.3239 -24.4132 71.7062 -19.7407 63.6132C-15.0682 55.5202 -7.37216 49.6148 1.65442 47.1961C10.681 44.7775 20.2987 46.0437 28.3917 50.7162Z"
          stroke={AUTH_COLORS.decor}
          strokeWidth={2}
        />
        <Path
          d="M-24.9291 143.07L3.15522 159.285C51.7628 187.349 69.384 242.889 43.815 287.176C20.4287 327.682 -18.9259 340.967 -63.4858 324.601C-33.5693 328.912 -13.4743 315.31 -2.56066 296.407C14.5893 266.702 -2.37556 237.464 -34.7806 218.755L-60.1645 204.1C-68.2575 199.427 -74.1629 191.731 -76.5816 182.705C-79.0003 173.678 -77.7341 164.061 -73.0616 155.968C-68.3891 147.874 -60.693 141.969 -51.6664 139.55C-42.6398 137.132 -33.0221 138.398 -24.9291 143.07Z"
          stroke={AUTH_COLORS.decor}
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}

/** Position absolue de la décoration, indépendante du côté. */
const styles = StyleSheet.create({
  decor: { position: "absolute" },
});
