import { fireEvent, render, screen } from "@testing-library/react-native";

import { FIELD_CHROME } from "../../../shared/theme/theme.field";
import { PhoneField } from "./field.phone";

describe("PhoneField", () => {
  it("affiche l'indicatif du Congo et groupe les chiffres", async () => {
    await render(<PhoneField digits="065706622" onChange={jest.fn()} />);

    expect(screen.getByText("+242")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("06 570 66 22")).toBeOnTheScreen();
  });

  it("n'affiche pas d'icône de téléphone, l'indicatif suffit", async () => {
    await render(<PhoneField digits="" onChange={jest.fn()} />);

    expect(screen.queryByTestId("auth-icon-phone")).toBeNull();
  });

  it("retire l'indicatif +242 que le membre tape lui-même", async () => {
    const onChange = jest.fn();
    await render(<PhoneField digits="" onChange={onChange} />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "+242 06 570 66 22");

    expect(onChange).toHaveBeenCalledWith("065706622");
  });

  it("laisse effacer un espace, en effaçant le chiffre qui le précède", async () => {
    const onChange = jest.fn();
    await render(<PhoneField digits="065706622" onChange={onChange} />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "06 570 6622");

    expect(onChange).toHaveBeenCalledWith("06570622");
  });

  it("ne transmet que les neuf premiers chiffres", async () => {
    const onChange = jest.fn();
    await render(<PhoneField digits="" onChange={onChange} />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "06 570-66 22 99");

    expect(onChange).toHaveBeenCalledWith("065706622");
  });

  it("garde la saisie au focus puis à la sortie du champ", async () => {
    await render(<PhoneField digits="06" onChange={jest.fn()} />);

    await fireEvent(screen.getByLabelText("Numéro de téléphone"), "focus");
    await fireEvent(screen.getByLabelText("Numéro de téléphone"), "blur");

    expect(screen.getByDisplayValue("06")).toBeOnTheScreen();
  });

  it("dessine un anneau bleu au focus", async () => {
    await render(<PhoneField digits="" onChange={jest.fn()} />);

    await fireEvent(screen.getByLabelText("Numéro de téléphone"), "focus");

    expect(screen.getByTestId("phone-field")).toHaveStyle({
      outlineWidth: 3,
      outlineColor: FIELD_CHROME.focusRing,
    });
  });

  it("dessine une bordure et un anneau rouges sur un numéro refusé", async () => {
    await render(<PhoneField digits="123" onChange={jest.fn()} invalid />);

    expect(screen.getByTestId("phone-field")).toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
      outlineWidth: 3,
      outlineColor: FIELD_CHROME.errorRing,
    });
  });
});
