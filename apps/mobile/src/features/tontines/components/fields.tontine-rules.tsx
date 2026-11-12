import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetSelect } from "../../../shared/components/macros/field.sheet-select";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { TONTINE_CADENCE_GROUPS } from "../model/model.tontine-form";
import type { TontineSettingsForm } from "../model/model.tontine-settings-form";

/** Props des règles d'une tontine en cours de réglage. */
export interface TontineRulesFieldsProps {
  readonly form: TontineSettingsForm;
  /** Vrai une fois la tontine lancée : les règles ne se modifient plus. */
  readonly locked: boolean;
  readonly onChange: (patch: Partial<TontineSettingsForm>) => void;
}

/**
 * Règles de la tontine : cotisation et fréquence, modifiables seulement avant
 * le lancement.
 * @param props Saisie, verrou et changement.
 * @returns Les champs des règles, ou l'explication du verrou.
 */
export function TontineRulesFields(props: TontineRulesFieldsProps) {
  const { form, locked, onChange } = props;
  if (locked) {
    return (
      <SheetText>
        La cotisation et la fréquence ne changent plus une fois la tontine lancée.
      </SheetText>
    );
  }

  return (
    <>
      <SheetTextField
        label="Cotisation par tour (FCFA)"
        value={form.contribution}
        onChangeText={(contribution) => onChange({ contribution })}
        keyboardType="number-pad"
      />
      <SheetSelect
        label="Fréquence des tours"
        groups={TONTINE_CADENCE_GROUPS}
        value={form.cadence}
        onChange={(cadence) => onChange({ cadence })}
      />
    </>
  );
}
