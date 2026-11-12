import type { CurrentUser } from "@mitemo/contracts";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { identityApi } from "../../../shared/api/config.api";
import { useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerProfileScreen } from "./screen.server-profile";

jest.mock("../../../shared/api/config.api", () => ({
  identityApi: { updateMe: jest.fn(), logout: jest.fn() },
}));
const USER = {
  userId: "019a6f4b-e680-7000-8000-000000000001",
  displayName: "Aimée Mbemba",
  maskedPhoneNumber: "+242*****22",
  role: "USER",
} as CurrentUser;
describe("profil connecté", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSessionStore.getState().signIn(USER);
  });
  it("met à jour le nom seulement après la réponse serveur", async () => {
    jest.mocked(identityApi.updateMe).mockResolvedValue({ ...USER, displayName: "Aimée" });
    await renderWithSafeArea(<ServerProfileScreen />);
    await fireEvent.changeText(screen.getByLabelText("Nom public"), "Aimée");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer le nom" }));
    await waitFor(() => expect(useSessionStore.getState().user?.displayName).toBe("Aimée"));
    expect(identityApi.updateMe).toHaveBeenCalledWith({ displayName: "Aimée" });
    expect(screen.getByText(USER.maskedPhoneNumber)).toBeOnTheScreen();
  });
  it("ne modifie pas le profil local après un échec réseau", async () => {
    jest.mocked(identityApi.updateMe).mockRejectedValue(new Error("offline"));
    await renderWithSafeArea(<ServerProfileScreen />);
    await fireEvent.changeText(screen.getByLabelText("Nom public"), "Autre nom");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer le nom" }));
    expect(await screen.findByText(/Modification non confirmée/)).toBeOnTheScreen();
    expect(useSessionStore.getState().user).toEqual(USER);
  });
  it("ferme la session locale même si la révocation distante est impossible", async () => {
    jest.mocked(identityApi.logout).mockRejectedValue(new Error("offline"));
    await renderWithSafeArea(<ServerProfileScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Se déconnecter" }));
    await waitFor(() => expect(useSessionStore.getState().signedIn).toBe(false));
    expect(useSessionStore.getState().user).toBeNull();
  });
});
