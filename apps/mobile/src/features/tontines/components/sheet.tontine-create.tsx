import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetStepsFooter } from "../../../shared/components/macros/footer.sheet-steps";
import { SheetOptionList } from "../../../shared/components/macros/list.sheet-option";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import { useTontineCreate } from "../hooks/hook.tontine-create";
import type { TontineFormState, TontineRecap } from "../model/model.tontine-form";
import {
  TONTINE_CADENCE_OPTIONS,
  TONTINE_FORM_STEPS,
  tontineRecap,
} from "../model/model.tontine-form";

/** Props de la feuille de création d'une tontine. */
export interface TontineCreateSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** Props des champs de la tontine en cours de saisie. */
interface TontineCreateFieldsProps {
  readonly form: TontineFormState;
  readonly onChange: (patch: Partial<TontineFormState>) => void;
}

/**
 * Première étape : le nom et la cotisation d'une nouvelle tontine.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs d'identité de la tontine.
 */
function TontineEssentialsStep(props: TontineCreateFieldsProps) {
  const { form, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Nom"
        value={form.name}
        onChangeText={(name) => onChange({ name })}
        hint="Le nom que verront les membres."
      />
      <SheetTextField
        label="Cotisation par tour (FCFA)"
        value={form.contribution}
        onChangeText={(contribution) => onChange({ contribution })}
        keyboardType="number-pad"
        placeholder="5000"
        hint="Montant versé par chaque membre à chaque tour."
      />
    </>
  );
}

/**
 * Deuxième étape : la fréquence des tours, choisie dans une liste.
 * @param props Saisie courante et mise à jour des champs.
 * @returns La liste des fréquences proposées.
 */
function TontineCadenceStep(props: TontineCreateFieldsProps) {
  const { form, onChange } = props;

  return (
    <SheetSection title="Fréquence des tours">
      <SheetOptionList
        options={TONTINE_CADENCE_OPTIONS}
        selected={form.cadence}
        onSelect={(cadence) => onChange({ cadence })}
      />
    </SheetSection>
  );
}

/**
 * Construit les lignes du récapitulatif d'une tontine en cours de saisie.
 * @param recap Valeurs calculées à partir du formulaire.
 * @returns Les lignes affichables, dans l'ordre choisi.
 */
function recapRows(recap: TontineRecap): readonly SheetRecapRow[] {
  const rows: SheetRecapRow[] = [];
  if (recap.pot !== null) {
    rows.push({ label: "Cagnotte par tour", value: `${formatAmount(recap.pot)} FCFA` });
  }
  if (recap.frequency !== null) {
    rows.push({ label: "Fréquence", value: formatFrequency(recap.frequency) });
  }

  return rows;
}

/**
 * Dernière étape : les participants, les tours et le récapitulatif.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs du cycle et le récapitulatif.
 */
function TontineParticipantsStep(props: TontineCreateFieldsProps) {
  const { form, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Participants"
        value={form.participants}
        onChangeText={(participants) => onChange({ participants })}
        keyboardType="number-pad"
        hint="Vous inclus, entre 2 et 50."
      />
      <SheetTextField
        label="Tours"
        value={form.rounds}
        onChangeText={(rounds) => onChange({ rounds })}
        keyboardType="number-pad"
        hint="Nombre de bénéficiaires sur le cycle."
      />
      <SheetRecap title="Récapitulatif" rows={recapRows(tontineRecap(form))} />
    </>
  );
}

/** Contenu de chaque étape, dans l'ordre de TONTINE_FORM_STEPS. */
const STEP_CONTENTS = [TontineEssentialsStep, TontineCadenceStep, TontineParticipantsStep];

/**
 * Saisit les règles d'une nouvelle tontine en trois étapes et la crée dans le
 * portefeuille.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle tontine ».
 */
export function TontineCreateSheet(props: TontineCreateSheetProps) {
  const { form, error, steps, update, next, back, close } = useTontineCreate(props.onClose);
  const StepContent = STEP_CONTENTS[steps.index] ?? TontineEssentialsStep;

  return (
    <BottomSheet visible={props.visible} title="Nouvelle tontine" onClose={close}>
      <StepIndicator
        index={steps.index}
        total={steps.total}
        title={TONTINE_FORM_STEPS[steps.index] ?? ""}
      />
      <StepContent form={form} onChange={update} />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetStepsFooter
        isFirst={steps.isFirst}
        isLast={steps.isLast}
        finalLabel="Créer la tontine"
        onBack={back}
        onNext={next}
      />
    </BottomSheet>
  );
}
