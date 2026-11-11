import { fireEvent, render, screen } from "@testing-library/react-native";

import {
  INITIAL_PROFILE_PREFERENCES,
  useProfilePreferences,
} from "../../hooks/store.profile-preferences";
import { NotificationsSheet } from "./sheet.notifications";

describe("NotificationsSheet", () => {
  beforeEach(() => useProfilePreferences.setState(INITIAL_PROFILE_PREFERENCES));

  it("active une catégorie coupée", async () => {
    await render(<NotificationsSheet />);

    await fireEvent(screen.getByLabelText("Annonces"), "valueChange", true);

    expect(useProfilePreferences.getState().notifications.announcements).toBe(true);
  });
});
