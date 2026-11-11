import { useState } from "react";

import type { StepForm } from "../../../shared/hooks/hook.step-form";
import { useStepForm } from "../../../shared/hooks/hook.step-form";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { CreateTontineInput } from "../../../shared/member/model.portfolio-create";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { TontineFormState } from "../model/model.tontine-form";
import {
  INITIAL_TONTINE_FORM,
  TONTINE_FORM_STEPS,
  parseTontineForm,
  tontineStepError,
} from "../model/model.tontine-form";

/** Règles de la création, indépendantes de la feuille qui l'affiche. */
const CREATE_RULES = {
  initial: INITIAL_TONTINE_FORM,
  total: TONTINE_FORM_STEPS.length,
  validateStep: tontineStepError,
  parse: parseTontineForm,
  keepOpenAfterCreate: true,
} as const;

/** Saisie de la création, avec la tontine confirmée une fois créée. */
export interface TontineCreateState extends StepForm<TontineFormState> {
  /** Tontine créée, affichée dans la confirmation, `null` avant la création. */
  readonly tontine: Tontine | null;
  /** Ferme la confirmation et repart d'un formulaire vierge. */
  readonly finish: () => void;
  /** Ouvre le code d'invitation de la tontine créée. */
  readonly invite: () => void;
  /** Code d'invitation à partager, `null` tant qu'il n'est pas demandé. */
  readonly invitationCode: string | null;
}

/**
 * Gère la saisie en quatre étapes et la création d'une tontine. La feuille
 * reste ouverte après la création pour proposer d'inviter les membres.
 * @param onDone Appelé quand la feuille doit se fermer.
 * @returns La saisie, l'erreur, l'étape courante, la tontine créée et les actions.
 */
export function useTontineCreate(onDone: () => void): TontineCreateState {
  const createTontine = usePortfolioStore((state) => state.createTontine);
  const inviteMember = usePortfolioStore((state) => state.inviteMember);
  const [tontine, setTontine] = useState<Tontine | null>(null);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const onCreate = (input: CreateTontineInput) => setTontine(createTontine(input));
  const stepForm = useStepForm({ ...CREATE_RULES, onCreate, onDone });

  const finish = () => {
    setTontine(null);
    setInvitationCode(null);
    stepForm.finish();
  };
  const invite = () => {
    if (tontine !== null) setInvitationCode(inviteMember(tontine.id));
  };

  return { ...stepForm, finish, invite, invitationCode, tontine };
}
