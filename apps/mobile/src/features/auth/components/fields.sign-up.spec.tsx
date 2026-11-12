import { fireEvent, render, screen } from "@testing-library/react-native";

import { FIELD_CHROME } from "../../../shared/theme/theme.field";
import type { SignUpForm } from "../hooks/hook.sign-up-form";
import { SignUpFields } from "./fields.sign-up";

/**
 * Formulaire de test, vide, dont seule la mise à jour est observée.
 * @returns Le formulaire.
 */
function emptyForm(): SignUpForm {
  return {
    firstName: "",
    lastName: "",
    occupation: "",
    digits: "",
    error: "",
    message: "",
    invalid: { firstName: false, lastName: false, occupation: false, digits: false },
    validPhone: false,
    submit: jest.fn(),
    update: jest.fn(),
    termsOpen: false,
    acceptTerms: jest.fn(),
    declineTerms: jest.fn(),
  };
}

describe("SignUpFields", () => {
  it("transmet chaque saisie au champ correspondant", async () => {
    const form = emptyForm();
    await render(<SignUpFields form={form} />);

    await fireEvent.changeText(screen.getByLabelText("Prénom"), "Aimée");
    await fireEvent.changeText(screen.getByLabelText("Nom"), "Mbemba");
    await fireEvent.changeText(screen.getByLabelText("Profession ou formation"), "Commerçante");
    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");

    expect(form.update).toHaveBeenCalledWith("firstName", "Aimée");
    expect(form.update).toHaveBeenCalledWith("lastName", "Mbemba");
    expect(form.update).toHaveBeenCalledWith("occupation", "Commerçante");
    expect(form.update).toHaveBeenCalledWith("digits", "065706622");
  });

  it("entoure de rouge les champs signalés", async () => {
    const form = emptyForm();
    await render(
      <SignUpFields
        form={{
          ...form,
          invalid: { firstName: true, lastName: false, occupation: false, digits: false },
        }}
      />,
    );

    expect(screen.getByTestId("auth-field-firstName")).toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
      outlineColor: FIELD_CHROME.errorRing,
    });
    expect(screen.getByTestId("auth-field-lastName")).not.toHaveStyle({
      outlineColor: FIELD_CHROME.errorRing,
    });
  });
});
