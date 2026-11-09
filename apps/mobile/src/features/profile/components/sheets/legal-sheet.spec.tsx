import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../../shared/testing/render-with-safe-area";
import { LegalSheet } from "./legal-sheet";

/** Sections d'un document légal de test. */
const SECTIONS = [
  { title: "Données collectées", body: "Nous collectons votre nom et votre numéro." },
  { title: "Vos droits", body: "Vous pouvez demander la suppression de vos données." },
] as const;

describe("LegalSheet", () => {
  it("affiche la date de mise à jour et les sections", async () => {
    await renderWithSafeArea(<LegalSheet updatedAt="novembre 2026" sections={SECTIONS} />);

    expect(screen.getByText("Dernière mise à jour : novembre 2026.")).toBeOnTheScreen();
    expect(screen.getByText("Données collectées")).toBeOnTheScreen();
    expect(screen.getByText("Nous collectons votre nom et votre numéro.")).toBeOnTheScreen();
    expect(screen.getByText("Vos droits")).toBeOnTheScreen();
  });
});
