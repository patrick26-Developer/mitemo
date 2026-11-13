import { useState } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { useSessionPinCheck } from "./hook.session-pin";
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
 * @param verifyCurrent Vérification du code actuel, qui compte les échecs.
 * @returns La vérification de chaque étape.
 */
function pinChangeChecks(codes: PinChangeCodes, verifyCurrent: (pin: string) => Promise<boolean>) {
  return [
    {
      verify: verifyCurrent,
      rejectedMessage: PIN_REJECTED_MESSAGE,
    },
    {
      verify: (pin) => Promise.resolve(isNewPin(codes.current, pin)),
      rejectedMessage: SAME_PIN_MESSAGE,
    },
    {
      verify: async (pin) => pin === codes.next && changePin(codes, PIN_AUTH_DEPS),
      rejectedMessage: PIN_MISMATCH_MESSAGE,
    },
  ] as const satisfies readonly PinChangeCheck[];
}

/**
 * Déroule le changement de code PIN en trois étapes, puis l'annonce.
 * @param onDone Fin du changement, une fois le code remplacé.
 * @returns L'étape courante, sa vérification, le passage à la suivante et la
 * suspension du compte.
 */
export function usePinChange(onDone: () => void) {
  const [step, setStep] = useState(0);
  const [codes, setCodes] = useState<PinChangeCodes>({ current: "", next: "" });
  const show = useToastStore((state) => state.show);
  const guarded = useSessionPinCheck();
  const checks = pinChangeChecks(codes, guarded.verify);
  const accept = (pin: string) => {
    if (step === 0) setCodes((value) => ({ ...value, current: pin }));
    if (step === 1) setCodes((value) => ({ ...value, next: pin }));
    if (step < 2) return setStep(step + 1);
    show("success", "Code PIN modifié.");
    onDone();
  };

  return { step, check: checks[step] ?? checks[0], accept, suspended: guarded.suspended };
}
