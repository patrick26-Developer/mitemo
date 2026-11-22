import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { savingsApi } from "../../../shared/api/config.api";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerGoalForm } from "./form.server-goal";

jest.mock("../../../shared/api/config.api", () => ({ savingsApi: { create: jest.fn() } }));
describe("création connectée d'un objectif", () => {
  beforeEach(() => jest.clearAllMocks());
  it("refuse une saisie vide sans écrire sur le serveur", async () => {
    await renderWithSafeArea(<ServerGoalForm onCreated={jest.fn()} />);
    await fireEvent.press(screen.getByRole("button", { name: "Créer l’objectif" }));
    expect(await screen.findByText(/Nom, montant entier/)).toBeOnTheScreen();
    expect(savingsApi.create).not.toHaveBeenCalled();
  });
  it("ne crée qu'un programme et attend le serveur avant de rafraîchir", async () => {
    jest.mocked(savingsApi.create).mockResolvedValue({} as never);
    const onCreated = jest.fn();
    await renderWithSafeArea(<ServerGoalForm onCreated={onCreated} />);
    await fireEvent.changeText(screen.getByLabelText("Nom de l’objectif"), "Fournitures");
    await fireEvent.changeText(screen.getByLabelText("Versement mensuel en XAF"), "500");
    await fireEvent.changeText(screen.getByLabelText("Nombre d’échéances"), "3");
    await fireEvent.changeText(screen.getByLabelText("Première échéance AAAA-MM-JJ"), "2026-11-30");
    await fireEvent.press(screen.getByRole("button", { name: "Créer l’objectif" }));
    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(savingsApi.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Fournitures" }),
    );
    expect(await screen.findByText(/Aucun montant débité/)).toBeOnTheScreen();
  });
});
