import { render, screen } from "@testing-library/react-native";

import { TermsSheet } from "./sheet.terms";

describe("TermsSheet", () => {
  it("affiche les conditions d'utilisation datées", async () => {
    await render(<TermsSheet />);

    expect(screen.getByText("Dernière mise à jour : novembre 2026.")).toBeOnTheScreen();
    expect(screen.getByText("Objet du service")).toBeOnTheScreen();
  });
});
