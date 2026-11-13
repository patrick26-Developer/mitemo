import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { ViewInstance } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import type { MeasureTarget } from "../../feedback/store.money-flight";
import { useMoneyFlightStore } from "../../feedback/store.money-flight";

/**
 * Oublie la somme qui quitte l'écran, sauf si une autre a déjà pris sa place.
 * @param measure Mesure de la somme qui part.
 */
function forgetTarget(measure: MeasureTarget): void {
  const store = useMoneyFlightStore.getState();
  if (store.measureTarget === measure) store.registerTarget(null);
}

/** Props de la somme qui reçoit l'argent. */
export interface MoneyFlightTargetProps {
  readonly children: ReactNode;
}

/**
 * Somme où l'argent payé vient se poser : elle se déclare tant qu'elle est à
 * l'écran et rebondit à chaque arrivée.
 * @param props Somme affichée.
 * @returns La somme, prête à recevoir l'argent.
 */
export function MoneyFlightTarget(props: MoneyFlightTargetProps) {
  const ref = useRef<ViewInstance>(null);
  const landings = useMoneyFlightStore((state) => state.landings);
  const seenLandings = useRef(landings);
  const scale = useSharedValue(1);
  const bump = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  useEffect(() => {
    const measure: MeasureTarget = (done) => {
      const box = ref.current?.getBoundingClientRect();
      if (box !== undefined) done({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
    };
    useMoneyFlightStore.getState().registerTarget(measure);
    return () => forgetTarget(measure);
  }, []);
  useEffect(() => {
    if (landings === seenLandings.current) return;
    seenLandings.current = landings;
    scale.set(withSequence(withTiming(1.08, { duration: 120 }), withSpring(1)));
  }, [landings, scale]);

  return (
    <Animated.View ref={ref} style={bump}>
      {props.children}
    </Animated.View>
  );
}
