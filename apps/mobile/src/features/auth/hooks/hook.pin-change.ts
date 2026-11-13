import { useState } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { useMemberStore } from "../../../shared/member/store.member";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { checkPin } from "../model/model.pin-auth";
import {
  changePin,
  isNewPin,
  PIN_MISMATCH_MESSAGE,
  SAME_PIN_MESSAGE,
} from "../model/model.pin-change";
import { PIN_REJECTED_MESSAGE } from "./hook.pin-validation";

/** Vérification d'une étape et message d'un code refusé. */
export interface PinChangeCheck {
  readonly verify: (pin: string) => Promise<boolean>;
  readonly rejectedMessage: string;
}

/** Codes déjà saisis : l'actuel, puis le nouveau. */
interface PinChangeCodes {
  readonly current: string;
  readonly next: string;
}

/**
 * Vérifications des trois étapes : l'actuel est reconnu, le nouveau en
 * diffère, la confirmation le reprend et remplace le code.
 * @param codes Code actuel et nouveau code déjà saisis.
 * @returns La vérification de chaque étape.
 */
function pinChangeChecks(codes: PinChangeCodes) {
  const phone = useMemberStore.getState().phone;

  return [
    {
      verify: (pin) => checkPin({ phone, pin }, PIN_AUTH_DEPS),
      rejectedMessage: PIN_REJECTED_MESSAGE,
    },
    {
      verify: (pin) => Promise.resolve(isNewPin(codes.current, pin)),
      rejectedMessage: SAME_PIN_MESSAGE,
    },
    {
      verify: async (pin) => pin === codes.next && changePin({ phone, ...codes }, PIN_AUTH_DEPS),
      rejectedMessage: PIN_MISMATCH_MESSAGE,
    },
  ] as const satisfies readonly PinChangeCheck[];
}

/**
 * Déroule le changement de code PIN en trois étapes, puis l'annonce.
 * @param onDone Fin du changement, une fois le code remplacé.
 * @returns L'étape courante, sa vérification et le passage à la suivante.
 */
export function usePinChange(onDone: () => void) {
  const [step, setStep] = useState(0);
  const [codes, setCodes] = useState<PinChangeCodes>({ current: "", next: "" });
  const show = useToastStore((state) => state.show);
  const accept = (pin: string) => {
    if (step === 0) setCodes((value) => ({ ...value, current: pin }));
    if (step === 1) setCodes((value) => ({ ...value, next: pin }));
    if (step < 2) return setStep(step + 1);
    show("success", "Code PIN modifié.");
    onDone();
  };

  return { step, check: pinChangeChecks(codes)[step] ?? pinChangeChecks(codes)[0], accept };
}
