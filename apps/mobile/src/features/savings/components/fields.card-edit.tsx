import { Text, View } from "react-native";

import { SheetNameField } from "../../../shared/components/macros/field.sheet-name";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import type { CardEditForm } from "../model/model.card-options";

/** Props des champs de modification d'une carte. */
export interface CardEditFieldsProps {
  readonly form: CardEditForm;
  /** `true` après le premier pointage : seuls les montants sont figés. */
  readonly locked: boolean;
  readonly onChange: (patch: Partial<CardEditForm>) => void;
}

/**
 * Champs modifiables d'une carte : le nom toujours, l'objectif et le pointage
 * seulement avant le premier pointage, quand aucun argent n'est engagé.
 * @param props Saisie, verrouillage et changement.
 * @returns Les champs.
 */
export function CardEditFields(props: CardEditFieldsProps) {
  const { form, locked, onChange } = props;

  return (
    <View className="gap-4">
      <SheetNameField
        value={form.name}
        onChangeText={(name) => onChange({ name })}
        hint="Le nom de votre projet."
      />
      {locked ? <LockedAmountsNote /> : <CardAmountFields form={form} onChange={onChange} />}
    </View>
  );
}

/** Props des champs de montant. */
interface CardAmountFieldsProps {
  readonly form: CardEditForm;
  readonly onChange: (patch: Partial<CardEditForm>) => void;
}

/**
 * Objectif et montant d'un pointage, saisis au clavier numérique.
 * @param props Saisie et changement.
 * @returns Les deux champs.
 */
function CardAmountFields(props: CardAmountFieldsProps) {
  const { form, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Objectif (FCFA)"
        value={form.goal}
        onChangeText={(goal) => onChange({ goal })}
        keyboardType="number-pad"
        hint="Le montant que vous voulez réunir."
      />
      <SheetTextField
        label="Montant par pointage (FCFA)"
        value={form.markerAmount}
        onChangeText={(markerAmount) => onChange({ markerAmount })}
        keyboardType="number-pad"
        hint="Il fixe le niveau et la couleur de la carte."
      />
    </>
  );
}

/**
 * Rappelle pourquoi les montants ne se modifient plus.
 * @returns La note.
 */
function LockedAmountsNote() {
  return (
    <Text className="text-[13px] leading-[18px] text-muted">
      L&apos;objectif et le montant d&apos;un pointage se modifient seulement avant le premier
      pointage : depuis, votre argent suit ce plan.
    </Text>
  );
}
