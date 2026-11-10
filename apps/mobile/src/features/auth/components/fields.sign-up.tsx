import type { SignUpForm } from "../hooks/hook.sign-up-form";
import { AuthTextField } from "./field.auth-text";
import { PhoneField } from "./field.phone";

/** Props des champs d'inscription. */
export interface SignUpFieldsProps {
  readonly form: SignUpForm;
}

/**
 * Affiche l'identité, la profession et le numéro de l'inscription.
 * @param props Formulaire courant.
 * @returns Les quatre champs de la première étape.
 */
export function SignUpFields(props: SignUpFieldsProps) {
  const { form } = props;

  return (
    <>
      <AuthTextField
        kind="firstName"
        value={form.firstName}
        onChangeText={(value) => form.update("firstName", value)}
      />
      <AuthTextField
        kind="lastName"
        value={form.lastName}
        onChangeText={(value) => form.update("lastName", value)}
      />
      <AuthTextField
        kind="occupation"
        value={form.occupation}
        onChangeText={(value) => form.update("occupation", value)}
      />
      <PhoneField digits={form.digits} onChange={(value) => form.update("digits", value)} />
    </>
  );
}
