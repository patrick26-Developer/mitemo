import type { SignUpForm } from "../hooks/use-sign-up-form";
import { AuthTextField } from "./auth-text-field";
import { PhoneField } from "./phone-field";

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
        placeholder="Précieuse"
        value={form.firstName}
        onChangeText={(value) => form.update("firstName", value)}
        accessibilityLabel="Prénom"
      />
      <AuthTextField
        placeholder="Mavoungou"
        value={form.lastName}
        onChangeText={(value) => form.update("lastName", value)}
        accessibilityLabel="Nom"
      />
      <AuthTextField
        placeholder="Commerçante, étudiante…"
        value={form.occupation}
        onChangeText={(value) => form.update("occupation", value)}
        accessibilityLabel="Profession ou formation"
      />
      <PhoneField digits={form.digits} onChange={(value) => form.update("digits", value)} />
    </>
  );
}
