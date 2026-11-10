import { Text, View } from "react-native";

import { SheetPrimaryButton } from "../../../../shared/components/atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../../../../shared/components/atoms/button.sheet-secondary";
import { SheetTextField } from "../../../../shared/components/macros/field.sheet-text";
import type { IdentityField, IdentityFormState } from "../../hooks/hook.identity-edit";
import { useIdentityEdit } from "../../hooks/hook.identity-edit";

/** Props du formulaire d'identité du profil. */
export interface IdentityEditFormProps {
  /** Revient à l'affichage en lecture seule. */
  readonly onDone: () => void;
}

/** Props des champs du formulaire d'identité. */
interface IdentityFieldsProps {
  readonly form: IdentityFormState;
  readonly onChange: (field: IdentityField, value: string) => void;
}

/** Props des actions du formulaire d'identité. */
interface IdentityActionsProps {
  readonly onSave: () => void;
  readonly onCancel: () => void;
}

/**
 * Affiche les trois champs modifiables de l'identité.
 * @param props Valeurs courantes et saisie.
 * @returns Les champs du formulaire.
 */
function IdentityFields(props: IdentityFieldsProps) {
  const { form, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Prénom"
        value={form.firstName}
        onChangeText={(value) => onChange("firstName", value)}
      />
      <SheetTextField
        label="Nom"
        value={form.lastName}
        onChangeText={(value) => onChange("lastName", value)}
      />
      <SheetTextField
        label="Profession ou formation"
        value={form.occupation}
        onChangeText={(value) => onChange("occupation", value)}
      />
    </>
  );
}

/**
 * Affiche les actions d'enregistrement et d'annulation du formulaire.
 * @param props Enregistrement et annulation.
 * @returns Les actions du formulaire.
 */
function IdentityActions(props: IdentityActionsProps) {
  const { onSave, onCancel } = props;

  return (
    <View className="gap-3">
      <SheetPrimaryButton label="Enregistrer" onPress={onSave} />
      <SheetSecondaryButton
        label="Annuler"
        accessibilityLabel="Annuler la modification"
        onPress={onCancel}
      />
    </View>
  );
}

/**
 * Modifie le prénom, le nom et la profession du membre depuis son profil.
 * @param props Retour à l'affichage en lecture seule.
 * @returns Le formulaire d'identité.
 */
export function IdentityEditForm(props: IdentityEditFormProps) {
  const { onDone } = props;
  const edit = useIdentityEdit(onDone);

  return (
    <View className="gap-3">
      <IdentityFields form={edit.form} onChange={edit.update} />
      {edit.form.error === "" ? null : (
        <Text accessibilityRole="alert" className="text-[13px] font-medium text-danger">
          {edit.form.error}
        </Text>
      )}
      <IdentityActions onSave={edit.save} onCancel={onDone} />
    </View>
  );
}
