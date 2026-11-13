import { View } from "react-native";

import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { StepTransition } from "../../../shared/components/atoms/transition.step";
import { useSessionStore } from "../../../shared/session/store.session";
import { usePinChange } from "../hooks/hook.pin-change";
import { PIN_CHANGE_STEPS } from "../model/model.pin-change";
import { SuspendedNotice } from "./notice.suspended";
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
  const { step, check, accept, suspended } = usePinChange(props.onDone);
  const signOut = useSessionStore((state) => state.signOut);
  const content = PIN_CHANGE_STEPS[step] ?? PIN_CHANGE_STEPS[0];
  if (suspended) return <SuspendedNotice onSwitchAccount={signOut} />;

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
