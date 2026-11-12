import { fireEvent, render, screen } from "@testing-library/react-native";

import { FIELD_CHROME } from "../../../shared/theme/theme.field";
import { AuthTextField } from "./field.auth-text";

describe("AuthTextField", () => {
  it("affiche le libellé et transmet la saisie", async () => {
    const onChangeText = jest.fn();
    await render(<AuthTextField kind="firstName" value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByLabelText("Prénom"), "Aimée");

    expect(screen.getByText("Prénom")).toBeOnTheScreen();
    expect(onChangeText).toHaveBeenCalledWith("Aimée");
  });

  it("explique à quoi sert la profession", async () => {
    await render(<AuthTextField kind="occupation" value="" onChangeText={jest.fn()} />);

    expect(screen.getByText("Sert à adapter vos tontines et votre suivi.")).toBeOnTheScreen();
    expect(screen.getByTestId("auth-icon-occupation")).toBeOnTheScreen();
  });

  it("n'affiche pas d'aide pour le nom", async () => {
    await render(<AuthTextField kind="lastName" value="Mbemba" onChangeText={jest.fn()} />);

    expect(screen.getByDisplayValue("Mbemba")).toBeOnTheScreen();
    expect(screen.queryByText(/Sert à adapter/)).toBeNull();
  });

  it("garde la saisie au focus puis à la sortie du champ", async () => {
    await render(<AuthTextField kind="firstName" value="Aimée" onChangeText={jest.fn()} />);

    await fireEvent(screen.getByLabelText("Prénom"), "focus");
    await fireEvent(screen.getByLabelText("Prénom"), "blur");

    expect(screen.getByDisplayValue("Aimée")).toBeOnTheScreen();
  });

  it("dessine un anneau bleu au focus", async () => {
    await render(<AuthTextField kind="firstName" value="" onChangeText={jest.fn()} />);

    await fireEvent(screen.getByLabelText("Prénom"), "focus");

    expect(screen.getByTestId("auth-field-firstName")).toHaveStyle({
      outlineWidth: 3,
      outlineColor: FIELD_CHROME.focusRing,
    });
  });

  it("dessine une bordure et un anneau rouges sur une saisie refusée", async () => {
    await render(<AuthTextField kind="firstName" value="" onChangeText={jest.fn()} invalid />);

    expect(screen.getByTestId("auth-field-firstName")).toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
      outlineWidth: 3,
      outlineColor: FIELD_CHROME.errorRing,
    });
  });
});
