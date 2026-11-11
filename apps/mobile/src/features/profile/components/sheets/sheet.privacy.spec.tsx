import { render, screen } from "@testing-library/react-native";

import { PrivacySheet } from "./sheet.privacy";

describe("PrivacySheet", () => {
  it("affiche la politique de confidentialité datée", async () => {
    await render(<PrivacySheet />);

    expect(screen.getByText("Dernière mise à jour : novembre 2026.")).toBeOnTheScreen();
    expect(screen.getByText("Données collectées")).toBeOnTheScreen();
  });
});
