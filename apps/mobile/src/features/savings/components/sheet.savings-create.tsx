import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useSavingsCreate } from "../hooks/hook.savings-create";
import type { SavingsFormState, SavingsRecap } from "../model/model.savings-form";
import { savingsRecap } from "../model/model.savings-form";
import { TontinePicker } from "./section.tontine-picker";

/** Props de la feuille de création d'une carte de pointage. */
export interface SavingsCreateSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** Props des champs de la carte en cours de saisie. */
interface SavingsCreateFieldsProps {
  readonly form: SavingsFormState;
  readonly tontines: readonly Tontine[];
  readonly onChange: (patch: Partial<SavingsFormState>) => void;
}

/** Props des champs d'identité d'une carte en cours de saisie. */
interface SavingsIdentityFieldsProps {
  readonly form: SavingsFormState;
  readonly onChange: (patch: Partial<SavingsFormState>) => void;
}

/**
 * Affiche le nom et le montant d'un marqueur d'une nouvelle carte.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs d'identité de la carte.
 */
function SavingsIdentityFields(props: SavingsIdentityFieldsProps) {
  const { form, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Nom"
        value={form.name}
        onChangeText={(name) => onChange({ name })}
        hint="Pour reconnaître cette carte dans vos listes."
      />
      <SheetTextField
        label="Montant d'un marqueur (FCFA)"
        value={form.markerAmount}
        onChangeText={(markerAmount) => onChange({ markerAmount })}
        keyboardType="number-pad"
        placeholder="5000"
        hint="Chaque marqueur ajoute ce montant à l'épargne."
      />
    </>
  );
}

/**
 * Affiche l'objectif, l'échéance et la tontine rattachée d'une nouvelle carte.
 * @param props Saisie courante, tontines disponibles et mise à jour des champs.
 * @returns Les champs de l'objectif de la carte.
 */
function SavingsTargetFields(props: SavingsCreateFieldsProps) {
  const { form, tontines, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Nombre de marqueurs"
        value={form.markersTotal}
        onChangeText={(markersTotal) => onChange({ markersTotal })}
        keyboardType="number-pad"
        hint="Entre 1 et 100."
      />
      <SheetTextField
        label="Échéance (JJ/MM/AAAA)"
        value={form.deadline}
        onChangeText={(deadline) => onChange({ deadline })}
        keyboardType="numbers-and-punctuation"
        placeholder="31/12/2026"
        hint="Dernier jour pour atteindre l'objectif."
      />
      <TontinePicker
        tontines={tontines}
        selected={form.tontineId}
        onSelect={(tontineId) => onChange({ tontineId })}
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
 * Saisit les règles d'une nouvelle carte et la crée dans le portefeuille, en la
 * rattachant éventuellement à une tontine.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle carte ».
 */
export function SavingsCreateSheet(props: SavingsCreateSheetProps) {
  const { visible, onClose } = props;
  const { form, error, update, submit } = useSavingsCreate(onClose);
  const tontines = usePortfolioStore((state) => state.tontines);
  const recap = savingsRecap(form);

  return (
    <BottomSheet visible={visible} title="Nouvelle carte" onClose={onClose}>
      <SavingsIdentityFields form={form} onChange={update} />
      <SavingsTargetFields form={form} tontines={tontines} onChange={update} />
      <SheetRecap title="Récapitulatif" rows={recapRows(recap)} />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetPrimaryButton label="Créer la carte" onPress={submit} />
    </BottomSheet>
  );
}
