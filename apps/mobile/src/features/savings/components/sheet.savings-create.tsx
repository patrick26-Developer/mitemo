import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { SheetDateField } from "../../../shared/components/macros/field.sheet-date";
import { SheetSelect } from "../../../shared/components/macros/field.sheet-select";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetStepsFooter } from "../../../shared/components/macros/footer.sheet-steps";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { tomorrowUtc } from "../../../shared/model/model.clock";
import { FREQUENCY_SELECT_GROUPS } from "../../../shared/model/model.frequency";
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

/**
 * Première étape : le nom, l'objectif et le montant proposé par pointage.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs du projet.
 */
function SavingsProjectStep(
  props: Pick<SavingsCreateFieldsProps, "form" | "invalid" | "onChange">,
) {
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
        label="Objectif (FCFA)"
        value={form.goal}
        onChangeText={(goal) => onChange({ goal })}
        keyboardType="number-pad"
        placeholder="30000"
        hint="Le montant que vous voulez réunir."
        invalid={invalid.goal}
      />
      <SheetTextField
        label="Montant par pointage (FCFA)"
        value={form.markerAmount}
        onChangeText={(markerAmount) => onChange({ markerAmount })}
        keyboardType="number-pad"
        placeholder="5000"
        hint="Ce que vous mettez de côté à chaque pointage."
        invalid={invalid.markerAmount}
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
  const rows = [
    recap.goal === null ? null : { label: "Objectif", value: `${formatAmount(recap.goal)} FCFA` },
    recap.markerAmount === null
      ? null
      : { label: "Par pointage", value: `${formatAmount(recap.markerAmount)} FCFA` },
    recap.frequency === null
      ? null
      : { label: "Fréquence", value: formatFrequency(recap.frequency) },
    recap.markers === null ? null : { label: "Pointages prévus", value: `${recap.markers}` },
    recap.deadline === null ? null : { label: "Échéance", value: formatLongDate(recap.deadline) },
  ];

  return rows.flatMap((row) => (row === null ? [] : [row]));
}

/**
 * Deuxième étape : le rythme des pointages, l'échéance au calendrier, la
 * tontine rattachée et le récapitulatif.
 * @param props Saisie courante, tontines disponibles et mise à jour des champs.
 * @returns Les champs du rythme.
 */
function SavingsRhythmStep(props: SavingsCreateFieldsProps) {
  const { form, invalid, tontines, onChange } = props;

  return (
    <>
      <SheetSelect
        label="Fréquence des pointages"
        groups={FREQUENCY_SELECT_GROUPS}
        value={form.cadence}
        onChange={(cadence) => onChange({ cadence })}
        hint="Le rythme auquel vous mettez de côté."
      />
      <SheetDateField
        label="Échéance"
        value={form.deadline}
        minimum={tomorrowUtc()}
        onChange={(deadline) => onChange({ deadline })}
        hint="Dernier jour pour atteindre l'objectif."
        invalid={invalid.deadline}
      />
      <TontinePicker
        tontines={tontines}
        selected={form.tontineId}
        onSelect={(tontineId) => onChange({ tontineId })}
      />
      <SheetRecap title="Récapitulatif" rows={recapRows(savingsRecap(form, new Date()))} />
    </>
  );
}

/**
 * Saisit les règles d'une nouvelle carte en deux étapes et la crée dans le
 * portefeuille, avec autant de pointages que le rythme en permet.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle carte ».
 */
export function SavingsCreateSheet(props: SavingsCreateSheetProps) {
  const { form, error, steps, update, next, back, close } = useSavingsCreate(props.onClose);
  const tontines = usePortfolioStore((state) => state.tontines);
  const flags = savingsInvalidFields(form);
  const invalid: SavingsInvalidFields = {
    name: error !== null && flags.name,
    goal: error !== null && flags.goal,
    markerAmount: error !== null && flags.markerAmount,
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
        <SavingsProjectStep form={form} invalid={invalid} onChange={update} />
      ) : (
        <SavingsRhythmStep form={form} invalid={invalid} tontines={tontines} onChange={update} />
      )}
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
