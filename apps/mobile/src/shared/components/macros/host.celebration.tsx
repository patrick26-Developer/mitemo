import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { playFeedbackSound, playSuccessHaptic } from "../../feedback/api.feedback-effects";
import { useFeedbackPreferences } from "../../feedback/store.feedback-preferences";
import { useCelebrationStore } from "../../feedback/store.celebration";
import { confettiPieces } from "../../model/model.confetti";
import { ConfettiPiece } from "../atoms/piece.confetti";

/** Durée de la célébration, en millisecondes : la plus longue chute et son attente. */
export const CELEBRATION_MS = 3200;

/** Nombre de confettis d'une salve. */
const CONFETTI_COUNT = 96;

/**
 * Joue le carillon et le retour haptique de réussite au début de la salve,
 * selon les préférences du membre, puis l'efface une fois la pluie finie.
 * @param burstId Salve en cours, `null` sans célébration.
 */
function useBurstEnd(burstId: number | null): void {
  const finish = useCelebrationStore((state) => state.finish);
  const { vibration, sound } = useFeedbackPreferences();
  useEffect(() => {
    if (burstId === null) return undefined;
    if (vibration) void playSuccessHaptic();
    if (sound) void playFeedbackSound("success");
    const timer = setTimeout(finish, CELEBRATION_MS);
    return () => clearTimeout(timer);
  }, [burstId, finish, vibration, sound]);
}

/**
 * Pluie de confettis par-dessus toute l'application, avec un carillon et une
 * vibration, à
 * la création d'un compte, d'une tontine ou d'une carte : la page d'arrivée
 * s'ouvre sous les confettis, qui laissent passer les touchers.
 * Le membre peut couper confettis, son et vibration depuis son profil.
 * @returns La pluie de confettis, ou rien sans célébration.
 */
export function CelebrationHost() {
  const burst = useCelebrationStore((state) => state.burst);
  const confetti = useFeedbackPreferences((state) => state.confetti);
  const { width, height } = useWindowDimensions();
  useBurstEnd(burst?.id ?? null);
  if (burst === null || !confetti) return null;
  const pieces = confettiPieces({ count: CONFETTI_COUNT, seed: burst.id });

  return (
    <View testID="celebration-host" pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, index) => (
        <ConfettiPiece key={`${burst.id}-${index}`} piece={piece} area={{ width, height }} />
      ))}
    </View>
  );
}
