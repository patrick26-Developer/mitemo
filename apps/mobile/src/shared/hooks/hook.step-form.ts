import { useState } from "react";

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
}

/**
 * Gère l'étape courante et le message d'erreur : revenir ou fermer efface
 * l'erreur, fermer repart de la première étape.
 * @param total Nombre d'étapes.
 * @param onDone Appelé à la fermeture.
 * @returns L'étape, l'erreur et les déplacements.
 */
function useStepFeedback(total: number, onDone: () => void): StepFeedback {
  const [error, report] = useState<string | null>(null);
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
  deps.config.onCreate(result.value);
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
  const feedback = useStepFeedback(config.total, config.onDone);
  const { error, steps, back, close } = feedback;
  const finish = () => {
    setForm(config.initial);
    close();
  };
  const next = () => advanceStepForm({ config, form, feedback, finish });
  const update = (patch: Partial<Form>) => setForm((current) => ({ ...current, ...patch }));

  return { form, error, steps, update, next, back, close };
}
