import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineDetailScreen } from "./screen.tontine-detail";

describe("TontineDetailScreen", () => {
  it("affiche la tontine demandée", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByRole("header", { name: "Tontine du Marché Tolal" })).toBeOnTheScreen();
    expect(screen.getAllByText(/5 000/).length).toBeGreaterThan(0);
    expect(screen.getByText("10 membres")).toBeOnTheScreen();
  });

  it("affiche le cycle et le bénéficiaire", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByText("Cycle en cours")).toBeOnTheScreen();
    expect(screen.getByText("4 sur 10")).toBeOnTheScreen();
    expect(screen.getAllByText("Mama Nadège").length).toBeGreaterThan(0);
  });

  it("affiche un état vide quand la tontine n'existe pas", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="inconnue" />);

    expect(screen.getByText("Tontine introuvable")).toBeOnTheScreen();
  });
});
