import type { SignUpForm } from "../hooks/hook.sign-up-form";
import { AUTH_ICON_DELAY, AUTH_ICON_STEP } from "../model/model.auth-theme";
import { AuthTextField } from "./field.auth-text";
import { PhoneField } from "./field.phone";

/** Props des champs d'inscription. */
export interface SignUpFieldsProps {
  readonly form: SignUpForm;
}

/**
 * Affiche l'identité, la profession et le numéro de l'inscription. Les icônes
 * se dessinent l'une après l'autre, dans l'ordre de lecture.
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
        iconDelay={AUTH_ICON_DELAY}
        invalid={form.invalid.firstName}
      />
      <AuthTextField
        kind="lastName"
        value={form.lastName}
        onChangeText={(value) => form.update("lastName", value)}
        iconDelay={AUTH_ICON_DELAY + AUTH_ICON_STEP}
        invalid={form.invalid.lastName}
      />
      <AuthTextField
        kind="occupation"
        value={form.occupation}
        onChangeText={(value) => form.update("occupation", value)}
        iconDelay={AUTH_ICON_DELAY + AUTH_ICON_STEP * 2}
        invalid={form.invalid.occupation}
      />
      <PhoneField
        digits={form.digits}
        onChange={(value) => form.update("digits", value)}
        invalid={form.invalid.digits}
      />
    </>
  );
}
