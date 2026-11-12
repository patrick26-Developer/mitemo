import { useState } from "react";

import { useToastStore } from "../feedback/store.toast";
import type { FormResult } from "../model/model.form-result";
import type { FormSteps } from "./hook.form-steps";
import { useFormSteps } from "./hook.form-steps";

/** Règles d'un formulaire en plusieurs étapes qui aboutit à une création. */
export interface StepFormConfig<Form, Output> {
  readonly initial: Form;
  /** Nombre d'étapes, au moins deux. */
  readonly total: number;
  /** Rend le message à corriger pour l'étape donnée, ou `null` si elle est valide. */
  readonly validateStep: (form: Form, step: number) => string | null;
  /** Valide tout le formulaire à la dernière étape. */
  readonly parse: (form: Form) => FormResult<Output>;
  readonly onCreate: (value: Output) => void;
  /** Appelé quand la feuille doit se fermer, après création ou abandon. */
  readonly onDone: () => void;
  /**
   * Laisse la feuille ouverte après la création, pour afficher la confirmation
   * et les suites possibles (inviter des membres, partager un code).
   */
  readonly keepOpenAfterCreate?: boolean;
}

/** Saisie, erreur, étape courante et actions d'un formulaire en plusieurs étapes. */
export interface StepForm<Form> {
  readonly form: Form;
  readonly error: string | null;
  readonly steps: FormSteps;
  readonly update: (patch: Partial<Form>) => void;
  /** Valide l'étape courante, puis passe à la suivante ou crée. */
  readonly next: () => void;
  readonly back: () => void;
  /** Ferme : la saisie est gardée, l'étape repart de la première. */
  readonly close: () => void;
  /** Vrai après une création réussie, tant que la confirmation est affichée. */
  readonly created: boolean;
  /** Ferme la confirmation : vide la saisie et repart de la première étape. */
  readonly finish: () => void;
}

/** Étape courante, erreur affichée et déplacements d'un formulaire en étapes. */
interface StepFeedback {
  readonly error: string | null;
  readonly report: (message: string | null) => void;
  readonly steps: FormSteps;
  readonly back: () => void;
  readonly close: () => void;
}

/** Dépendances d'un passage à l'étape suivante. */
interface AdvanceDeps<Form, Output> {
  readonly config: StepFormConfig<Form, Output>;
  readonly form: Form;
  readonly feedback: StepFeedback;
  /** Vide la saisie et ferme, une fois la création faite. */
  readonly finish: () => void;
  /** Garde la feuille ouverte sur une confirmation de création. */
  readonly stayOpen: () => void;
}

/**
 * Gère l'étape courante et le message d'erreur, annoncé dans un toast :
 * revenir ou fermer efface l'erreur, fermer repart de la première étape.
 * @param total Nombre d'étapes.
 * @param onDone Appelé à la fermeture.
 * @returns L'étape, l'erreur et les déplacements.
 */
function useStepFeedback(total: number, onDone: () => void): StepFeedback {
  const [error, setError] = useState<string | null>(null);
  const show = useToastStore((state) => state.show);
  const report = (message: string | null) => {
    setError(message);
    if (message !== null) show("error", message);
  };
  const steps = useFormSteps(total);
  const back = () => {
    report(null);
    steps.back();
  };
  const close = () => {
    report(null);
    steps.reset();
    onDone();
  };

  return { error, report, steps, back, close };
}

/**
 * Crée à partir de la valeur validée, ou signale l'échec avec la possibilité
 * de réessayer.
 * @param config Règles du formulaire.
 * @param value Valeur validée.
 * @param feedback Erreur affichée dans la feuille.
 * @returns Vrai si la création a abouti.
 */
function tryCreate<Form, Output>(
  config: StepFormConfig<Form, Output>,
  value: Output,
  feedback: StepFeedback,
): boolean {
  try {
    config.onCreate(value);
    return true;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "La création a échoué.";
    feedback.report(`${reason} Réessayez.`);
    return false;
  }
}

/**
 * Valide tout le formulaire à la dernière étape, puis crée ou signale le
 * message à corriger.
 * @param deps Configuration, saisie, erreur et suite après création.
 */
function completeStepForm<Form, Output>(deps: AdvanceDeps<Form, Output>): void {
  const result = deps.config.parse(deps.form);
  if (!result.ok) {
    deps.feedback.report(result.message);
    return;
  }
  if (!tryCreate(deps.config, result.value, deps.feedback)) return;
  if (deps.config.keepOpenAfterCreate === true) {
    deps.stayOpen();
    return;
  }
  deps.finish();
}

/**
 * Valide l'étape courante, puis passe à la suivante ou, à la dernière, valide
 * tout le formulaire et crée.
 * @param deps Configuration, saisie, étape courante et suite après création.
 */
function advanceStepForm<Form, Output>(deps: AdvanceDeps<Form, Output>): void {
  const { config, form, feedback } = deps;
  const message = config.validateStep(form, feedback.steps.index);
  feedback.report(message);
  if (message !== null) return;
  if (!feedback.steps.isLast) {
    feedback.steps.next();
    return;
  }
  completeStepForm(deps);
}

/**
 * Gère un formulaire découpé en étapes : chaque étape est validée avant de
 * passer à la suivante, et la dernière déclenche la création.
 * @param config Règles du formulaire et rappels de création et de fermeture.
 * @returns La saisie, l'erreur, l'étape courante et les actions.
 */
export function useStepForm<Form extends object, Output>(
  config: StepFormConfig<Form, Output>,
): StepForm<Form> {
  const [form, setForm] = useState(config.initial);
  const [created, setCreated] = useState(false);
  const feedback = useStepFeedback(config.total, config.onDone);
  const { error, steps, back, close, report } = feedback;
  const finish = () => {
    setCreated(false);
    setForm(config.initial);
    close();
  };
  const stayOpen = () => {
    report(null);
    setCreated(true);
  };
  const next = () => advanceStepForm({ config, form, feedback, finish, stayOpen });
  const update = (patch: Partial<Form>) => setForm((current) => ({ ...current, ...patch }));

  return { form, error, steps, update, next, back, close, created, finish };
}
