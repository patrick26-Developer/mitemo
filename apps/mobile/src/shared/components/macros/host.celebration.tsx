import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, Vibration, View } from "react-native";

import { useCelebrationStore } from "../../feedback/store.celebration";
import { confettiPieces } from "../../model/model.confetti";
import { ConfettiPiece } from "../atoms/piece.confetti";

/** Durée de la célébration, en millisecondes : la plus longue chute et son attente. */
export const CELEBRATION_MS = 3200;

/** Nombre de confettis d'une salve. */
const CONFETTI_COUNT = 48;

/** Vibration de la célébration : deux impulsions brèves (Android ; iOS vibre une fois). */
const CELEBRATION_VIBRATION = [0, 40, 70, 40];

/**
 * Efface la salve une fois la pluie finie.
 * @param burstId Salve en cours, `null` sans célébration.
 */
function useBurstEnd(burstId: number | null): void {
  const finish = useCelebrationStore((state) => state.finish);
  useEffect(() => {
    if (burstId === null) return undefined;
    Vibration.vibrate(CELEBRATION_VIBRATION);
    const timer = setTimeout(finish, CELEBRATION_MS);
    return () => clearTimeout(timer);
  }, [burstId, finish]);
}

/**
 * Pluie de confettis par-dessus toute l'application, avec une vibration, à
 * la création d'un compte, d'une tontine ou d'une carte : la page d'arrivée
 * s'ouvre sous les confettis, qui laissent passer les touchers.
 * @returns La pluie de confettis, ou rien sans célébration.
 */
export function CelebrationHost() {
  const burst = useCelebrationStore((state) => state.burst);
  const { width, height } = useWindowDimensions();
  useBurstEnd(burst?.id ?? null);
  if (burst === null) return null;
  const pieces = confettiPieces({ count: CONFETTI_COUNT, seed: burst.id });

  return (
    <View testID="celebration-host" pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, index) => (
        <ConfettiPiece key={`${burst.id}-${index}`} piece={piece} area={{ width, height }} />
      ))}
    </View>
  );
}
