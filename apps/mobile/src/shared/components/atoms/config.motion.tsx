import { ReducedMotionConfig } from "react-native-reanimated";

import { useFeedbackPreferences } from "../../feedback/store.feedback-preferences";
import { reduceMotionMode } from "../../model/model.motion";

/**
 * Applique à toute l'application la préférence « Animations » du profil :
 * coupée, plus aucune animation Reanimated ne se joue.
 * @returns Le réglage global, sans rendu visible.
 */
export function MotionConfig() {
  const animations = useFeedbackPreferences((state) => state.animations);

  return <ReducedMotionConfig mode={reduceMotionMode(animations)} />;
}
