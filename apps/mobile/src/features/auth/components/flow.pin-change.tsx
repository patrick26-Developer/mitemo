import { View } from "react-native";

import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { StepTransition } from "../../../shared/components/atoms/transition.step";
import { usePinChange } from "../hooks/hook.pin-change";
import { PIN_CHANGE_STEPS } from "../model/model.pin-change";
import { PinChangeStepEntry } from "./step.pin-change";

/** Props du changement de code PIN. */
export interface PinChangeProps {
  /** Fin du changement, une fois le nouveau code enregistré. */
  readonly onDone: () => void;
}

/**
 * Changement du code PIN en trois étapes, avec leur indicateur : le code
 * actuel, le nouveau (différent de l'actuel), puis sa confirmation.
 * @param props Fin du changement.
 * @returns Le parcours de changement de code.
 */
export function PinChange(props: PinChangeProps) {
  const { step, check, accept } = usePinChange(props.onDone);
  const content = PIN_CHANGE_STEPS[step] ?? PIN_CHANGE_STEPS[0];

  return (
    <View className="gap-4">
      <StepIndicator index={step} total={PIN_CHANGE_STEPS.length} title={content?.title ?? ""} />
      <StepTransition index={step}>
        <SheetText>{content?.prompt ?? ""}</SheetText>
        <PinChangeStepEntry key={step} check={check} onAccepted={accept} />
      </StepTransition>
    </View>
  );
}
