import { fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsCreateSheet } from "./sheet.savings-create";

/**
 * Remplit la première étape et passe à l'échéance.
 * @param name Nom de la carte.
 */
async function fillCard(name = "Loyer de Février"): Promise<void> {
  await fireEvent.changeText(screen.getByLabelText("Nom"), name);
  await fireEvent.changeText(screen.getByLabelText("Montant d'un marqueur (FCFA)"), "5000");
  await fireEvent.changeText(screen.getByLabelText("Nombre de marqueurs"), "6");
  await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
}

describe("SavingsCreateSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("commence à l'étape 1 sur 2, sans échéance ni bouton Annuler", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    expect(screen.getByRole("progressbar", { name: "Étape 1 sur 2 : La carte" })).toBeOnTheScreen();
    expect(screen.queryByLabelText("Échéance (JJ/MM/AAAA)")).toBeNull();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });

  it("reste à la première étape tant que le nom manque", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Donnez un nom à la carte.")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 2/ })).toBeOnTheScreen();
  });

  it("résume l'objectif et l'échéance à la deuxième étape", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillCard();

    await fireEvent.changeText(screen.getByLabelText("Échéance (JJ/MM/AAAA)"), "31/12/2027");

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 2 : L'échéance" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("31 décembre 2027")).toBeOnTheScreen();
    expect(screen.getByTestId("sheet-action-row")).toBeOnTheScreen();
  });

  it("revient à la première étape en gardant la saisie", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillCard();

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(screen.getByDisplayValue("Loyer de Février")).toBeOnTheScreen();
  });

  it("crée la carte et convertit l'échéance en date ISO", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);
    await fillCard();

    await fireEvent.changeText(screen.getByLabelText("Échéance (JJ/MM/AAAA)"), "28/02/2027");
    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const created = usePortfolioStore
      .getState()
      .cards.find((item) => item.name === "Loyer de Février");
    expect(created?.deadline).toBe("2027-02-28");
    expect(created?.markersTotal).toBe(6);
  });

  it("refuse une échéance invalide", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);
    await fillCard("Assurance");

    await fireEvent.changeText(screen.getByLabelText("Échéance (JJ/MM/AAAA)"), "30/02/2027");
    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(screen.getByText("Saisissez une échéance au format JJ/MM/AAAA.")).toBeOnTheScreen();
    expect(onClose).not.toHaveBeenCalled();
  });
});
