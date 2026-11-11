import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetStepsFooter } from "../../../shared/components/macros/footer.sheet-steps";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useSavingsCreate } from "../hooks/hook.savings-create";
import type {
  SavingsFormState,
  SavingsInvalidFields,
  SavingsRecap,
} from "../model/model.savings-form";
import {
  SAVINGS_FORM_STEPS,
  savingsInvalidFields,
  savingsRecap,
} from "../model/model.savings-form";
import { TontinePicker } from "./section.tontine-picker";

/** Props de la feuille de création d'une carte de pointage. */
export interface SavingsCreateSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** Props des champs de la carte en cours de saisie. */
interface SavingsCreateFieldsProps {
  readonly form: SavingsFormState;
  readonly invalid: SavingsInvalidFields;
  readonly tontines: readonly Tontine[];
  readonly onChange: (patch: Partial<SavingsFormState>) => void;
}

/** Props des champs de la première étape d'une carte en cours de saisie. */
interface SavingsCardStepProps {
  readonly form: SavingsFormState;
  readonly invalid: SavingsInvalidFields;
  readonly onChange: (patch: Partial<SavingsFormState>) => void;
}

/**
 * Première étape : le nom, le montant et le nombre de marqueurs de la carte.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs de la carte.
 */
function SavingsCardStep(props: SavingsCardStepProps) {
  const { form, invalid, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Nom"
        value={form.name}
        onChangeText={(name) => onChange({ name })}
        hint="Pour reconnaître cette carte dans vos listes."
        invalid={invalid.name}
      />
      <SheetTextField
        label="Montant d'un marqueur (FCFA)"
        value={form.markerAmount}
        onChangeText={(markerAmount) => onChange({ markerAmount })}
        keyboardType="number-pad"
        placeholder="5000"
        hint="Chaque marqueur ajoute ce montant à l'épargne."
        invalid={invalid.markerAmount}
      />
      <SheetTextField
        label="Nombre de marqueurs"
        value={form.markersTotal}
        onChangeText={(markersTotal) => onChange({ markersTotal })}
        keyboardType="number-pad"
        hint="Entre 1 et 100."
        invalid={invalid.markersTotal}
      />
    </>
  );
}

/**
 * Construit les lignes du récapitulatif d'une carte en cours de saisie.
 * @param recap Valeurs calculées à partir du formulaire.
 * @returns Les lignes affichables, dans l'ordre choisi.
 */
function recapRows(recap: SavingsRecap): readonly SheetRecapRow[] {
  const rows: SheetRecapRow[] = [];
  if (recap.goal !== null) {
    rows.push({ label: "Objectif", value: `${formatAmount(recap.goal)} FCFA` });
  }
  if (recap.deadline !== null) {
    rows.push({ label: "Échéance", value: formatLongDate(recap.deadline) });
  }

  return rows;
}

/**
 * Dernière étape : l'échéance, la tontine rattachée et le récapitulatif.
 * @param props Saisie courante, tontines disponibles et mise à jour des champs.
 * @returns Les champs de l'échéance de la carte.
 */
function SavingsDeadlineStep(props: SavingsCreateFieldsProps) {
  const { form, invalid, tontines, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Échéance (JJ/MM/AAAA)"
        value={form.deadline}
        onChangeText={(deadline) => onChange({ deadline })}
        keyboardType="numbers-and-punctuation"
        placeholder="31/12/2026"
        hint="Dernier jour pour atteindre l'objectif."
        invalid={invalid.deadline}
      />
      <TontinePicker
        tontines={tontines}
        selected={form.tontineId}
        onSelect={(tontineId) => onChange({ tontineId })}
      />
      <SheetRecap title="Récapitulatif" rows={recapRows(savingsRecap(form))} />
    </>
  );
}

/**
 * Saisit les règles d'une nouvelle carte en deux étapes et la crée dans le
 * portefeuille, en la rattachant éventuellement à une tontine.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle carte ».
 */
export function SavingsCreateSheet(props: SavingsCreateSheetProps) {
  const { form, error, steps, update, next, back, close } = useSavingsCreate(props.onClose);
  const tontines = usePortfolioStore((state) => state.tontines);
  const flags = savingsInvalidFields(form);
  const invalid: SavingsInvalidFields = {
    name: error !== null && flags.name,
    markerAmount: error !== null && flags.markerAmount,
    markersTotal: error !== null && flags.markersTotal,
    deadline: error !== null && flags.deadline,
  };

  return (
    <BottomSheet visible={props.visible} title="Nouvelle carte" onClose={close}>
      <StepIndicator
        index={steps.index}
        total={steps.total}
        title={SAVINGS_FORM_STEPS[steps.index] ?? ""}
      />
      {steps.isFirst ? (
        <SavingsCardStep form={form} invalid={invalid} onChange={update} />
      ) : (
        <SavingsDeadlineStep form={form} invalid={invalid} tontines={tontines} onChange={update} />
      )}
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetStepsFooter
        isFirst={steps.isFirst}
        isLast={steps.isLast}
        finalLabel="Créer la carte"
        onBack={back}
        onNext={next}
      />
    </BottomSheet>
  );
}
