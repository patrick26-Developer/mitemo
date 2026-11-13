import { fireEvent, screen } from "@testing-library/react-native";

import { useSupportContactStore } from "../../../shared/support/store.support-contact";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SuspendedNotice } from "./notice.suspended";

jest.mock("../../../shared/support/config.support", () => ({
  supportApi: {
    contact: jest.fn(async () => ({ phoneNumber: "+242065706622", maxAgeSeconds: 86_400 })),
  },
}));

describe("SuspendedNotice", () => {
  beforeEach(() => {
    useSupportContactStore.setState({ cache: null });
  });

  it("annonce la suspension et propose WhatsApp, l'appel et un autre compte", async () => {
    const onSwitchAccount = jest.fn();
    await renderWithSafeArea(<SuspendedNotice onSwitchAccount={onSwitchAccount} />);

    expect(screen.getByRole("header", { name: "Compte suspendu" })).toBeOnTheScreen();
    expect(
      await screen.findByRole("button", { name: "Écrire au service client sur WhatsApp" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Appeler le service client" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Changer de compte" }));

    expect(onSwitchAccount).toHaveBeenCalledTimes(1);
  });
});
