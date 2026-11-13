import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { playFeedbackSound } from "../feedback/api.feedback-effects";
import { useCelebrationStore } from "../feedback/store.celebration";
import { useFeedbackPreferences } from "../feedback/store.feedback-preferences";
import type { MoneyFlight } from "../feedback/store.money-flight";
import { useMoneyFlightStore } from "../feedback/store.money-flight";
import type { FlightPath, ScreenPoint } from "../model/model.money-flight";
import { FLIGHT_MS } from "../model/model.money-flight";

/** Hauteur du centre du bouton du dock au-dessus du bas de l'écran, en points. */
const DOCK_BUTTON_OFFSET = 44;

/** Trajet mesuré d'un vol précis. */
interface MeasuredPath {
  readonly id: number;
  readonly path: FlightPath;
}

/**
 * Pose l'argent sur la somme : bruit de pièces, puis la fête (confettis,
 * carillon et vibration), chacun selon les préférences du membre.
 */
function landWithFanfare(): void {
  useMoneyFlightStore.getState().land();
  if (useFeedbackPreferences.getState().sound) void playFeedbackSound("coin");
  useCelebrationStore.getState().celebrate();
}

/**
 * Déroule le vol de l'argent : il part du bouton du dock, en bas au centre,
 * vers la somme affichée, puis s'y pose au bout de `FLIGHT_MS`. Sans somme à
 * l'écran, ou animations coupées, l'argent se pose tout de suite.
 * @returns Le vol en cours et son trajet, `null` tant qu'il n'est pas mesuré.
 */
export function useMoneyFlight(): { flight: MoneyFlight | null; path: FlightPath | null } {
  const flight = useMoneyFlightStore((state) => state.flight);
  const [measured, setMeasured] = useState<MeasuredPath | null>(null);
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (flight === null) return undefined;
    const { measureTarget } = useMoneyFlightStore.getState();
    if (!useFeedbackPreferences.getState().animations || measureTarget === null) {
      landWithFanfare();
      return undefined;
    }
    const from: ScreenPoint = { x: width / 2, y: height - bottom - DOCK_BUTTON_OFFSET };
    measureTarget((to) => setMeasured({ id: flight.id, path: { from, to } }));
    const timer = setTimeout(landWithFanfare, FLIGHT_MS);
    return () => clearTimeout(timer);
  }, [flight, width, height, bottom]);

  const path = flight !== null && measured?.id === flight.id ? measured.path : null;
  return { flight, path };
}
