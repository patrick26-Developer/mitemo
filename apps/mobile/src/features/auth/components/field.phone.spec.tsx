import { fireEvent, render, screen } from "@testing-library/react-native";

import { PhoneField } from "./field.phone";

describe("PhoneField", () => {
  it("affiche l'indicatif du Congo et groupe les chiffres", async () => {
    await render(<PhoneField digits="065706622" onChange={jest.fn()} />);

    expect(screen.getByText("+242")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("06 570 66 22")).toBeOnTheScreen();
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
});
