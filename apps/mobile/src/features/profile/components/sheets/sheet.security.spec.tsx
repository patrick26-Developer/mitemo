import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../../shared/testing/util.render-with-safe-area";
import { SecuritySheet } from "./sheet.security";

describe("SecuritySheet", () => {
  beforeEach(() => useMemberStore.setState(INITIAL_MEMBER_PROFILE));

  it("affiche le numéro et la protection du code, au style des feuilles d'information", async () => {
    await renderWithSafeArea(<SecuritySheet />);

    expect(screen.getByText(INITIAL_MEMBER_PROFILE.phone)).toBeOnTheScreen();
    expect(screen.getByText("Demandé à chaque ouverture")).toBeOnTheScreen();
    expect(screen.getAllByTestId("fact-divider")).toHaveLength(1);
    expect(screen.getByText(/seule son empreinte est conservée/)).toBeOnTheScreen();
  });

  it("ouvre le changement de code en trois étapes, à commencer par le code actuel", async () => {
    await renderWithSafeArea(<SecuritySheet />);

    await fireEvent.press(screen.getByRole("button", { name: "Changer mon code PIN" }));

    expect(
      screen.getByRole("progressbar", { name: "Étape 1 sur 3 : Code actuel" }),
    ).toBeOnTheScreen();
  });
});
