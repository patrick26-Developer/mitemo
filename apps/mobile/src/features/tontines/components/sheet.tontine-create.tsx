import type { CycleFrequencyUnit } from "@mitemo/contracts";

import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SegmentedControl } from "../../../shared/components/macros/control.segmented";
import type { SegmentedControlOption } from "../../../shared/components/macros/control.segmented";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import { useTontineCreate } from "../hooks/hook.tontine-create";
import type { TontineFormState, TontineRecap } from "../model/model.tontine-form";
import { tontineRecap } from "../model/model.tontine-form";

/** Fréquences proposées à la création d'une tontine. */
const FREQUENCY_OPTIONS: readonly SegmentedControlOption<CycleFrequencyUnit>[] = [
  { value: "jour", label: "Jour" },
  { value: "semaine", label: "Semaine" },
  { value: "mois", label: "Mois" },
];

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
 * Affiche le nom et la cotisation d'une nouvelle tontine.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs d'identité de la tontine.
 */
function TontineIdentityFields(props: TontineCreateFieldsProps) {
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
 * Affiche la fréquence, l'intervalle, les participants et les tours d'une
 * nouvelle tontine.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs du cycle de la tontine.
 */
function TontineCycleFields(props: TontineCreateFieldsProps) {
  const { form, onChange } = props;

  return (
    <>
      <SheetSection title="Fréquence">
        <SegmentedControl
          options={FREQUENCY_OPTIONS}
          value={form.frequency}
          onChange={(frequency) => onChange({ frequency })}
        />
      </SheetSection>
      <SheetTextField
        label="Intervalle"
        value={form.interval}
        onChangeText={(interval) => onChange({ interval })}
        keyboardType="number-pad"
        hint="1 pour chaque période, 2 pour une période sur deux."
      />
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
    </>
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
 * Saisit les règles d'une nouvelle tontine et la crée dans le portefeuille.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle tontine ».
 */
export function TontineCreateSheet(props: TontineCreateSheetProps) {
  const { visible, onClose } = props;
  const { form, error, update, submit } = useTontineCreate(onClose);
  const recap = tontineRecap(form);

  return (
    <BottomSheet visible={visible} title="Nouvelle tontine" onClose={onClose}>
      <TontineIdentityFields form={form} onChange={update} />
      <TontineCycleFields form={form} onChange={update} />
      <SheetRecap title="Récapitulatif" rows={recapRows(recap)} />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetPrimaryButton label="Créer la tontine" onPress={submit} />
    </BottomSheet>
  );
}
