import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { ConfettiPiece as Piece } from "../../model/model.confetti";

/** Props d'un confetti. */
export interface ConfettiPieceProps {
  readonly piece: Piece;
  /** Largeur et hauteur de la zone de chute, en points. */
  readonly area: { readonly width: number; readonly height: number };
}

/**
 * Un confetti qui tombe du haut de l'écran en tournoyant et dérive sur le
 * côté, puis s'efface en bas. Animé sur le fil d'interface par Reanimated.
 * @param props Confetti tiré et zone de chute.
 * @returns Le confetti animé.
 */
export function ConfettiPiece(props: ConfettiPieceProps) {
  const { piece, area } = props;
  const progress = useSharedValue(0);
  useEffect(() => {
    const fall = withTiming(1, { duration: piece.duration, easing: Easing.out(Easing.quad) });
    progress.value = withDelay(piece.delay, fall);
  }, [piece, progress]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * progress.value,
    transform: [
      { translateY: -24 + progress.value * (area.height + 48) },
      { translateX: progress.value * piece.drift },
      { rotate: `${progress.value * piece.spin}deg` },
    ],
  }));
  const shape = {
    left: piece.x * area.width,
    width: piece.width,
    height: piece.square ? piece.width : piece.width / 2,
    backgroundColor: piece.color,
  };

  return <Animated.View testID="confetti-piece" style={[styles.piece, shape, style]} />;
}

/** Confetti posé en haut de la zone, aux coins à peine arrondis. */
const styles = StyleSheet.create({ piece: { position: "absolute", top: 0, borderRadius: 1.5 } });
