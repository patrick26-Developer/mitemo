import { useCallback, useRef, useState } from "react";

/** Étape du code à l'inscription : le choisir, puis le confirmer. */
export type PinChoicePhase = "choose" | "confirm";

/** Message d'une confirmation qui ne reprend pas le code choisi. */
export const PIN_MISMATCH_MESSAGE = "Les deux codes ne correspondent pas. Réessayez.";

/** Choix du code en deux saisies, branché sur la saisie du code PIN. */
export interface PinChoice {
  readonly phase: PinChoicePhase;
  /** Vérifie une saisie : la première est retenue, la seconde doit la reprendre. */
  readonly verify: (pin: string) => Promise<boolean>;
  /** Passe à la confirmation, ou termine une fois le code confirmé. */
  readonly accept: () => void;
  /** Revient au choix du code depuis la confirmation. */
  readonly restart: () => void;
}

/** Saisie à vérifier, et ce qu'il faut pour la juger. */
interface ChoiceCheck {
  readonly pin: string;
  /** Code choisi à la première saisie, `null` tant qu'il ne l'est pas. */
  readonly chosen: string | null;
  readonly register: (pin: string) => Promise<boolean>;
  /** Dernière saisie, retenue pour la passer à la confirmation. */
  readonly typed: { current: string };
}

/**
 * Juge une saisie : la première est retenue, la seconde doit la reprendre
 * avant d'être enregistrée.
 * @param check Saisie, code choisi, enregistrement et saisie retenue.
 * @returns Vrai si la saisie est acceptée.
 */
function verifyChoice(check: ChoiceCheck): Promise<boolean> {
  check.typed.current = check.pin;
  if (check.chosen === null) return Promise.resolve(true);
  return check.pin === check.chosen ? check.register(check.pin) : Promise.resolve(false);
}

/** Vérification asynchrone d'un code saisi. */
type Verify = (pin: string) => Promise<boolean>;

/**
 * Choix du code PIN à l'inscription : le membre le saisit, puis le saisit à
 * nouveau ; seul un code confirmé est enregistré.
 * @param register Enregistre le code confirmé.
 * @param onConfirmed Appelé une fois le code confirmé et enregistré.
 * @returns L'étape, la vérification et les transitions.
 */
export function usePinChoice(register: Verify, onConfirmed: () => void): PinChoice {
  const [chosen, setChosen] = useState<string | null>(null);
  const typed = useRef("");
  const verify = useCallback(
    (pin: string) => verifyChoice({ pin, chosen, register, typed }),
    [chosen, register],
  );
  const accept = useCallback(() => {
    if (chosen === null) setChosen(typed.current);
    else onConfirmed();
  }, [chosen, onConfirmed]);

  const phase = chosen === null ? "choose" : "confirm";

  return { phase, verify, accept, restart: () => setChosen(null) };
}
