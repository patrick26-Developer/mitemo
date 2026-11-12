import { useState } from "react";

import type { StepForm } from "../../../shared/hooks/hook.step-form";
import { useStepForm } from "../../../shared/hooks/hook.step-form";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { CreateTontineInput } from "../../../shared/member/model.portfolio-create";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { TontineFormState } from "../model/model.tontine-form";
import { shareInvitation } from "../api/api.share-invitation";
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
  /** Ouvre le partage du téléphone avec le message d'invitation. */
  readonly share: () => void;
  /** Code d'invitation, créé avec la tontine, `null` avant la création. */
  readonly invitationCode: string | null;
}

/**
 * Gère la saisie en quatre étapes et la création d'une tontine. Le code
 * d'invitation est créé avec la tontine, et la feuille reste ouverte pour le
 * partager tout de suite.
 * @param onDone Appelé quand la feuille doit se fermer.
 * @returns La saisie, l'erreur, l'étape courante, la tontine créée et les actions.
 */
export function useTontineCreate(onDone: () => void): TontineCreateState {
  const createTontine = usePortfolioStore((state) => state.createTontine);
  const inviteMember = usePortfolioStore((state) => state.inviteMember);
  const [created, setCreated] = useState<CreatedTontine | null>(null);
  const onCreate = (input: CreateTontineInput) =>
    setCreated(withInvitation(createTontine(input), inviteMember));
  const stepForm = useStepForm({ ...CREATE_RULES, onCreate, onDone });
  const finish = () => {
    setCreated(null);
    stepForm.finish();
  };

  return {
    ...stepForm,
    finish,
    share: () => shareCreated(created),
    invitationCode: created?.invitationCode ?? null,
    tontine: created?.tontine ?? null,
  };
}

/** Tontine tout juste créée et son code d'invitation. */
interface CreatedTontine {
  readonly tontine: Tontine;
  readonly invitationCode: string;
}

/**
 * Ouvre la feuille de partage native avec le message d'invitation.
 * @param created Tontine créée et son code, `null` avant la création.
 */
function shareCreated(created: CreatedTontine | null): void {
  if (created === null) return;
  shareInvitation(created.tontine, created.invitationCode);
}

/**
 * Associe à la tontine créée son premier code d'invitation.
 * @param tontine Tontine tout juste créée.
 * @param invite Génère un code d'invitation pour une tontine.
 * @returns La tontine et son code.
 */
function withInvitation(tontine: Tontine, invite: (id: Tontine["id"]) => string): CreatedTontine {
  return { tontine, invitationCode: invite(tontine.id) };
}
