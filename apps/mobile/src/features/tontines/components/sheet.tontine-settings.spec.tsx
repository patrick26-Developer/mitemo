import { fireEvent, screen } from "@testing-library/react-native";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { firstOf, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineSettingsSheet } from "./sheet.tontine-settings";

/**
 * Ouvre la feuille sur la tontine donnée, conservée dans le portefeuille.
 * @param state État de la tontine.
 * @returns La fermeture simulée.
 */
async function open(state: "PENDING" | "ACTIVE"): Promise<jest.Mock> {
  const tontine = makeTontine({ state });
  usePortfolioStore.setState({ tontines: [tontine] });
  const onClose = jest.fn();
  await renderWithSafeArea(<TontineSettingsSheet visible item={tontine} onClose={onClose} />);
  return onClose;
}

describe("TontineSettingsSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
    useToastStore.getState().dismiss();
  });

  it("change le nom, la couleur et les règles d'une tontine à lancer, sans toast", async () => {
    const onClose = await open("PENDING");

    await fireEvent.changeText(screen.getByLabelText("Nom"), "Tontine des Amis");
    await fireEvent.changeText(screen.getByLabelText("Cotisation par tour (FCFA)"), "10000");
    await fireEvent.press(screen.getByRole("radio", { name: "Rose" }));
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(firstOf(usePortfolioStore.getState().tontines)).toMatchObject({
      name: "Tontine des Amis",
      contribution: 10_000n,
      headerColors: ["#F2A0B5", "#FBD0DA"],
    });
    expect(useToastStore.getState().toast).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fige les règles d'une tontine lancée et n'en laisse que le nom et la couleur", async () => {
    await open("ACTIVE");

    expect(screen.queryByLabelText("Cotisation par tour (FCFA)")).toBeNull();
    expect(
      screen.getByText(
        "La cotisation et la fréquence ne changent plus une fois la tontine lancée.",
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole("radio", { name: "Vert", checked: true })).toBeOnTheScreen();
  });

  it("garde la feuille ouverte et explique l'erreur d'un nom invalide", async () => {
    const onClose = await open("PENDING");

    await fireEvent.changeText(screen.getByLabelText("Nom"), "ab");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(useToastStore.getState().toast?.message).toBe(
      "Le nom doit contenir au moins 3 caractères.",
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
