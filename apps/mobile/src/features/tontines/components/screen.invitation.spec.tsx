import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { INITIAL_PORTFOLIO } from "../../../shared/member/model.portfolio-initial";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { InvitationScreen } from "./screen.invitation";

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

/** Invitation livrée avec les données de démonstration. */
const INVITATION_ID = "invitation-poto-poto";

describe("InvitationScreen", () => {
  beforeEach(() => usePortfolioStore.setState({ ...INITIAL_PORTFOLIO }));

  it("montre la tontine avec « Refuser » et « Accepter » à la place de « Cotiser »", async () => {
    await renderWithSafeArea(<InvitationScreen id={INVITATION_ID} />);

    expect(screen.getByRole("header", { name: "Commerçantes de Poto-Poto" })).toBeOnTheScreen();
    expect(
      screen.getByText("Mama Nadège vous invite à rejoindre cette tontine."),
    ).toBeOnTheScreen();
    expect(screen.getByTestId("actions-dock")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Cotiser/ })).toBeNull();
  });

  it("accepte avec les tours choisis, puis ouvre la tontine rejointe", async () => {
    await renderWithSafeArea(<InvitationScreen id={INVITATION_ID} />);

    await fireEvent.press(screen.getByRole("button", { name: "Accepter" }));
    expect(screen.getByRole("header", { name: "Choisir mes tours" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Augmenter Nombre de tours" }));
    await fireEvent.press(screen.getByRole("button", { name: "Rejoindre" }));

    const [joined] = usePortfolioStore.getState().tontines;
    expect(joined?.members.find((member) => member.id === SELF_MEMBER_ID)?.turns).toBe(2);
    expect(router.replace).toHaveBeenCalledWith("/tontine/4");
  });

  it("refuse l'invitation, puis ferme l'écran", async () => {
    await renderWithSafeArea(<InvitationScreen id={INVITATION_ID} />);

    await fireEvent.press(screen.getByRole("button", { name: "Refuser" }));

    expect(usePortfolioStore.getState().invitations).toEqual([]);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("signale une invitation déjà traitée", async () => {
    await renderWithSafeArea(<InvitationScreen id="absente" />);

    expect(screen.getByText("Invitation introuvable")).toBeOnTheScreen();
  });
});
