import { Text, View } from "react-native";

import { SheetPrimaryButton } from "../../../../shared/components/atoms/button.sheet-primary";
import { SheetTextField } from "../../../../shared/components/macros/field.sheet-text";
import type {
  IdentityEdit,
  IdentityField,
  IdentityFormState,
} from "../../hooks/hook.identity-edit";
import { useIdentityEdit } from "../../hooks/hook.identity-edit";

/** Props du formulaire d'identité du profil. */
export interface IdentityEditFormProps {
  /** Revient à l'affichage en lecture seule. */
  readonly onDone: () => void;
}

/** Props des champs du formulaire d'identité. */
interface IdentityFieldsProps {
  readonly form: IdentityFormState;
  readonly invalid: IdentityEdit["invalid"];
  readonly onChange: (field: IdentityField, value: string) => void;
}

/**
 * Affiche les trois champs modifiables de l'identité.
 * @param props Valeurs courantes et saisie.
 * @returns Les champs du formulaire.
 */
function IdentityFields(props: IdentityFieldsProps) {
  const { form, invalid, onChange } = props;

  return (
    <>
      <SheetTextField
        label="Prénom"
        value={form.firstName}
        onChangeText={(value) => onChange("firstName", value)}
        invalid={invalid.firstName}
      />
      <SheetTextField
        label="Nom"
        value={form.lastName}
        onChangeText={(value) => onChange("lastName", value)}
        invalid={invalid.lastName}
      />
      <SheetTextField
        label="Profession ou formation"
        value={form.occupation}
        onChangeText={(value) => onChange("occupation", value)}
        invalid={invalid.occupation}
      />
    </>
  );
}

/**
 * Modifie le prénom, le nom et la profession du membre depuis son profil.
 * Abandonner passe par la croix de la feuille : pas de bouton « Annuler ».
 * @param props Retour à l'affichage en lecture seule.
 * @returns Le formulaire d'identité.
 */
export function IdentityEditForm(props: IdentityEditFormProps) {
  const { onDone } = props;
  const edit = useIdentityEdit(onDone);

  return (
    <View className="gap-3">
      <IdentityFields form={edit.form} invalid={edit.invalid} onChange={edit.update} />
      {edit.form.error === "" ? null : (
        <Text accessibilityRole="alert" className="text-[13px] font-medium text-danger">
          {edit.form.error}
        </Text>
      )}
      <SheetPrimaryButton label="Enregistrer" onPress={edit.save} />
    </View>
  );
}
