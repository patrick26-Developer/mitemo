import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { StepGuideSheet } from "./sheet.step-guide";

/** Contenu de test d'une feuille à étapes. */
const CONTENT = {
  title: "Nouvelle tontine",
  intro: "Une tontine réunit un groupe qui cotise à chaque tour.",
  steps: ["Choisissez le montant.", "Invitez les membres."],
  outro: "La création en ligne arrive bientôt.",
} as const;

describe("StepGuideSheet", () => {
  it("affiche le titre, l'introduction et la conclusion", async () => {
    await renderWithSafeArea(<StepGuideSheet content={CONTENT} visible onClose={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Nouvelle tontine" })).toBeOnTheScreen();
    expect(screen.getByText(CONTENT.intro)).toBeOnTheScreen();
    expect(screen.getByText(CONTENT.outro)).toBeOnTheScreen();
  });

  it("numérote les étapes dans l'ordre", async () => {
    await renderWithSafeArea(<StepGuideSheet content={CONTENT} visible onClose={jest.fn()} />);

    expect(screen.getByText("1")).toBeOnTheScreen();
    expect(screen.getByText("Choisissez le montant.")).toBeOnTheScreen();
    expect(screen.getByText("2")).toBeOnTheScreen();
    expect(screen.getByText("Invitez les membres.")).toBeOnTheScreen();
  });
});
