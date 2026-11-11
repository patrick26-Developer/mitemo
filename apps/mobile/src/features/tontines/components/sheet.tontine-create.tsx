import type { CycleFrequencyUnit } from "@mitemo/contracts";

import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SegmentedControl } from "../../../shared/components/macros/control.segmented";
import type { SegmentedControlOption } from "../../../shared/components/macros/control.segmented";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { useTontineCreate } from "../hooks/hook.tontine-create";

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

/**
 * Saisit les règles d'une nouvelle tontine et la crée dans le portefeuille.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle tontine ».
 */
export function TontineCreateSheet(props: TontineCreateSheetProps) {
  const { visible, onClose } = props;
  const { form, error, update, submit } = useTontineCreate(onClose);

  return (
    <BottomSheet visible={visible} title="Nouvelle tontine" onClose={onClose}>
      <SheetTextField label="Nom" value={form.name} onChangeText={(name) => update({ name })} />
      <SheetTextField
        label="Cotisation (FCFA)"
        value={form.contribution}
        onChangeText={(contribution) => update({ contribution })}
        keyboardType="number-pad"
        placeholder="5000"
      />
      <SheetSection title="Fréquence">
        <SegmentedControl
          options={FREQUENCY_OPTIONS}
          value={form.frequency}
          onChange={(frequency) => update({ frequency })}
        />
      </SheetSection>
      <SheetTextField
        label="Participants"
        value={form.participants}
        onChangeText={(participants) => update({ participants })}
        keyboardType="number-pad"
      />
      <SheetTextField
        label="Tours"
        value={form.rounds}
        onChangeText={(rounds) => update({ rounds })}
        keyboardType="number-pad"
      />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetPrimaryButton label="Créer la tontine" onPress={submit} />
    </BottomSheet>
  );
}
