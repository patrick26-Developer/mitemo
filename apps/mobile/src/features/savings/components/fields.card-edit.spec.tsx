import { fireEvent, render, screen } from "@testing-library/react-native";

import { CardEditFields } from "./fields.card-edit";

/** Saisie de test. */
const FORM = { name: "Loyer", goal: "30000", markerAmount: "5000" };

describe("CardEditFields", () => {
  it("propose de changer le nom, l'objectif et le pointage avant le premier pointage", async () => {
    const onChange = jest.fn();
    await render(<CardEditFields form={FORM} locked={false} onChange={onChange} />);

    await fireEvent.changeText(screen.getByLabelText("Objectif (FCFA)"), "60000");

    expect(screen.getByDisplayValue("Loyer")).toBeOnTheScreen();
    expect(screen.getByLabelText("Montant par pointage (FCFA)")).toBeOnTheScreen();
    expect(onChange).toHaveBeenCalledWith({ goal: "60000" });
  });

  it("ne laisse changer que le nom après le premier pointage, et dit pourquoi", async () => {
    await render(<CardEditFields form={FORM} locked onChange={jest.fn()} />);

    expect(screen.queryByLabelText("Objectif (FCFA)")).toBeNull();
    expect(screen.getByText(/se modifient seulement avant le premier pointage/)).toBeOnTheScreen();
  });
});
