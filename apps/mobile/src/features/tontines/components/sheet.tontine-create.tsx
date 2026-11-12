import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { SheetSelect } from "../../../shared/components/macros/field.sheet-select";
import { SheetStepper } from "../../../shared/components/macros/field.sheet-stepper";
import { SheetNameField } from "../../../shared/components/macros/field.sheet-name";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetStepsFooter } from "../../../shared/components/macros/footer.sheet-steps";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import { useTontineCreate } from "../hooks/hook.tontine-create";
import type {
  TontineFormState,
  TontineInvalidFields,
  TontineRecap,
} from "../model/model.tontine-form";
import {
  TONTINE_CADENCE_GROUPS,
  TONTINE_FORM_STEPS,
  tontineInvalidFields,
  tontineRecap,
} from "../model/model.tontine-form";
import { TontineCreatedPanel } from "./panel.tontine-created";

/** Props de la feuille de création d'une tontine. */
export interface TontineCreateSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** Props des champs de la tontine en cours de saisie. */
interface TontineCreateFieldsProps {
  readonly form: TontineFormState;
  readonly invalid: TontineInvalidFields;
  readonly onChange: (patch: Partial<TontineFormState>) => void;
}

/** Nombre minimal de participants proposé par le compteur. */
const MIN_PARTICIPANTS = 2;

/** Nombre maximal de participants proposé par le compteur. */
const MAX_PARTICIPANTS = 50;

/**
 * Première étape : le nom et la cotisation d'une nouvelle tontine.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs d'identité de la tontine.
 */
function TontineEssentialsStep(props: TontineCreateFieldsProps) {
  const { form, invalid, onChange } = props;

  return (
    <>
      <SheetNameField
        value={form.name}
        onChangeText={(name) => onChange({ name })}
        hint="Le nom que verront les membres."
        invalid={invalid.name}
      />
      <SheetTextField
        label="Cotisation par tour (FCFA)"
        value={form.contribution}
        onChangeText={(contribution) => onChange({ contribution })}
        keyboardType="number-pad"
        placeholder="5000"
        hint="Montant versé par chaque membre à chaque tour."
        invalid={invalid.contribution}
      />
    </>
  );
}

/**
 * Deuxième étape : la fréquence des tours, choisie dans une liste groupée.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Le sélecteur de fréquence.
 */
function TontineCadenceStep(props: TontineCreateFieldsProps) {
  const { form, onChange } = props;

  return (
    <SheetSelect
      label="Fréquence des tours"
      groups={TONTINE_CADENCE_GROUPS}
      value={form.cadence}
      onChange={(cadence) => onChange({ cadence })}
      hint="Le rythme auquel chaque membre verse sa cotisation."
    />
  );
}

/**
 * Construit les lignes du récapitulatif d'une tontine en cours de saisie.
 * @param form Saisie courante.
 * @param recap Valeurs calculées à partir du formulaire.
 * @returns Les lignes affichables, dans l'ordre choisi.
 */
function recapRows(form: TontineFormState, recap: TontineRecap): readonly SheetRecapRow[] {
  const name = form.name.trim();
  const rows = [
    name === "" ? null : { label: "Tontine", value: name },
    recap.frequency === null
      ? null
      : { label: "Fréquence", value: formatFrequency(recap.frequency) },
    recap.participants === null
      ? null
      : { label: "Participants", value: `${recap.participants} membres` },
    recap.pot === null
      ? null
      : { label: "Restourne par tour", value: `${formatAmount(recap.pot)} FCFA` },
    recap.cycleTotal === null
      ? null
      : { label: "Total du cycle", value: `${formatAmount(recap.cycleTotal)} FCFA` },
  ];

  return rows.flatMap((row) => (row === null ? [] : [row]));
}

/**
 * Calcule les champs à signaler en rouge, une fois la validation refusée.
 * @param form Saisie courante.
 * @param error Message de la validation, `null` avant tout refus.
 * @returns Vrai pour chaque champ qui ne respecte pas sa règle.
 */
function invalidFields(form: TontineFormState, error: string | null): TontineInvalidFields {
  const flags = tontineInvalidFields(form);

  return {
    name: error !== null && flags.name,
    contribution: error !== null && flags.contribution,
    participants: error !== null && flags.participants,
  };
}

/**
 * Troisième étape : le nombre de participants. Chaque participant reçoit la
 * cagnotte une fois, donc le cycle compte autant de tours que de participants.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Le compteur de participants.
 */
function TontineParticipantsStep(props: TontineCreateFieldsProps) {
  const { form, invalid, onChange } = props;

  return (
    <SheetStepper
      label="Participants"
      value={form.participants}
      min={MIN_PARTICIPANTS}
      max={MAX_PARTICIPANTS}
      onChange={(participants) => onChange({ participants })}
      hint="Vous inclus. Chacun reçoit la restourne une fois."
      invalid={invalid.participants}
    />
  );
}

/**
 * Dernière étape : tout ce qu'il faut savoir avant de créer. Le titre de
 * l'étape suffit, le récapitulatif n'en répète pas.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Le récapitulatif complet de la tontine.
 */
function TontineRecapStep(props: TontineCreateFieldsProps) {
  const { form } = props;

  return <SheetRecap rows={recapRows(form, tontineRecap(form))} />;
}

/** Contenu de chaque étape, dans l'ordre de TONTINE_FORM_STEPS. */
const STEP_CONTENTS = [
  TontineEssentialsStep,
  TontineCadenceStep,
  TontineParticipantsStep,
  TontineRecapStep,
];

/**
 * Saisit les règles d'une nouvelle tontine en quatre étapes, la crée puis
 * propose de partager son code d'invitation.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle tontine ».
 */
export function TontineCreateSheet(props: TontineCreateSheetProps) {
  const { form, error, steps, update, next, back, close, tontine, finish, share, invitationCode } =
    useTontineCreate(props.onClose);
  const StepContent = STEP_CONTENTS[steps.index] ?? TontineEssentialsStep;

  if (tontine !== null) {
    return (
      <BottomSheet visible={props.visible} title="Nouvelle tontine" onClose={finish}>
        <TontineCreatedPanel tontine={tontine} invitationCode={invitationCode} onShare={share} />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      visible={props.visible}
      title="Nouvelle tontine"
      onClose={close}
      footer={
        <SheetStepsFooter
          isFirst={steps.isFirst}
          isLast={steps.isLast}
          finalLabel="Créer la tontine"
          onBack={back}
          onNext={next}
        />
      }
    >
      <StepIndicator
        index={steps.index}
        total={steps.total}
        title={TONTINE_FORM_STEPS[steps.index] ?? ""}
      />
      <StepContent form={form} invalid={invalidFields(form, error)} onChange={update} />
    </BottomSheet>
  );
}
