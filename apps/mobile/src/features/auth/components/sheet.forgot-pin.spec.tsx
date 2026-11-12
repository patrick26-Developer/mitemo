import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ForgotPinSheet } from "./sheet.forgot-pin";

describe("ForgotPinSheet", () => {
  it("explique la réinitialisation dans une feuille, sans bouton Annuler", async () => {
    await renderWithSafeArea(<ForgotPinSheet visible onClose={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Code PIN oublié" })).toBeOnTheScreen();
    expect(screen.getByText(/réinitialisation par SMS/)).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });

  it("ne rend rien quand elle est fermée", async () => {
    await renderWithSafeArea(<ForgotPinSheet visible={false} onClose={jest.fn()} />);

    expect(screen.queryByText(/réinitialisation par SMS/)).not.toBeOnTheScreen();
  });
});
