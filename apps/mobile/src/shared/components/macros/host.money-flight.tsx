import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useMoneyFlight } from "../../hooks/hook.money-flight";
import type { FlightPath } from "../../model/model.money-flight";
import { FLIGHT_MS, flightPoint } from "../../model/model.money-flight";
import { MoneyFlightChip } from "../atoms/chip.money-flight";

/** Boîte de la pastille, centrée sur le point du trajet, en points. */
const CHIP_BOX = { width: 200, height: 40 } as const;

/** Courbe du vol : départ vif, arrivée posée. */
const FLIGHT_TIMING = { duration: FLIGHT_MS, easing: Easing.bezier(0.33, 0, 0.2, 1) };

/**
 * Fait voler l'argent payé du bouton du dock jusqu'à la somme affichée, au
 * premier plan, sans bloquer les touchers.
 * @returns L'argent en vol, ou rien.
 */
export function MoneyFlightHost() {
  const { flight, path } = useMoneyFlight();
  if (flight === null || path === null) return null;

  return <FlyingChip key={flight.id} amount={flight.amount} path={path} />;
}

/** Props de la pastille en vol. */
interface FlyingChipProps {
  readonly amount: bigint;
  readonly path: FlightPath;
}

/**
 * Pastille qui suit l'arc du trajet, rétrécit et s'efface en se posant.
 * @param props Montant et trajet.
 * @returns La pastille animée.
 */
function FlyingChip(props: FlyingChipProps) {
  const { amount, path } = props;
  const progress = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    const point = flightPoint(path, progress.get());
    return {
      opacity: interpolate(progress.get(), [0, 0.85, 1], [1, 1, 0.2]),
      transform: [
        { translateX: point.x - CHIP_BOX.width / 2 },
        { translateY: point.y - CHIP_BOX.height / 2 },
        { scale: interpolate(progress.get(), [0, 0.2, 1], [0.8, 1.1, 0.7]) },
      ],
    };
  });
  useEffect(() => {
    progress.set(withTiming(1, FLIGHT_TIMING));
  }, [progress]);

  return (
    <Animated.View testID="money-flight" pointerEvents="none" style={[styles.chip, style]}>
      <MoneyFlightChip amount={amount} />
    </Animated.View>
  );
}

/** Pastille posée au-dessus de tout, à l'origine de la fenêtre. */
const styles = StyleSheet.create({
  chip: {
    position: "absolute",
    left: 0,
    top: 0,
    ...CHIP_BOX,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    elevation: 24,
  },
});
