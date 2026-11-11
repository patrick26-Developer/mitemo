import { fireEvent, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineAdminPanel } from "./panel.tontine-admin";

describe("TontineAdminPanel", () => {
  it("propose de créer un code quand la tontine n'en a pas", async () => {
    const onInvite = jest.fn();
    await renderWithSafeArea(<TontineAdminPanel item={makeTontine()} onInvite={onInvite} />);

    await fireEvent.press(screen.getByRole("button", { name: "Créer un code d'invitation" }));

    expect(onInvite).toHaveBeenCalledTimes(1);
  });

  it("affiche le code existant sans promettre de le régénérer", async () => {
    await renderWithSafeArea(
      <TontineAdminPanel item={makeTontine({ invitationCode: "ABC123" })} onInvite={jest.fn()} />,
    );

    expect(screen.getByText("ABC123")).toBeOnTheScreen();
    expect(screen.queryByText("Régénérer le code")).not.toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Régénérer/ })).not.toBeOnTheScreen();
  });
});
