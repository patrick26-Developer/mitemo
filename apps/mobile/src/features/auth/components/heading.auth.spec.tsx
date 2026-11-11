import { fireEvent, render, screen } from "@testing-library/react-native";

import { AuthHeading } from "./heading.auth";

describe("AuthHeading", () => {
  it("affiche le titre comme en-tête et le sous-titre", async () => {
    await render(<AuthHeading title="Code PIN" subtitle="Saisissez votre code." />);

    expect(screen.getByRole("header", { name: "Code PIN" })).toBeOnTheScreen();
    expect(screen.getByText("Saisissez votre code.")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
  });

  it("propose le retour quand l'écran le permet", async () => {
    const onBack = jest.fn();
    await render(<AuthHeading title="Code PIN" subtitle="Saisissez." onBack={onBack} />);

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
