import { fireEvent, render, screen } from "@testing-library/react-native";

import {
  INITIAL_PROFILE_PREFERENCES,
  useProfilePreferences,
} from "../../hooks/store.profile-preferences";
import { PaymentSheet } from "./sheet.payment";

describe("PaymentSheet", () => {
  beforeEach(() => useProfilePreferences.setState(INITIAL_PROFILE_PREFERENCES));

  it("choisit le moyen de paiement principal", async () => {
    await render(<PaymentSheet />);

    await fireEvent.press(screen.getByRole("button", { name: /MTN Mobile Money/ }));

    expect(useProfilePreferences.getState().primaryPaymentId).toBe("mtn");
  });
});
