import { renderHook } from "@testing-library/react-native";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";

import { useReminderTap } from "./hook.reminder-tap";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

jest.mock("expo-notifications", () => ({
  DEFAULT_ACTION_IDENTIFIER: "default",
  useLastNotificationResponse: jest.fn(),
  clearLastNotificationResponse: jest.fn(),
}));

const lastResponse = jest.mocked(Notifications.useLastNotificationResponse);

/**
 * Simule le dernier toucher sur une notification.
 * @param data Données de la notification.
 * @param action Action choisie par le membre.
 */
function tapped(data: Record<string, unknown>, action = "default"): void {
  lastResponse.mockReturnValue({
    actionIdentifier: action,
    notification: { request: { content: { data } } },
  } as never);
}

describe("useReminderTap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ouvre la carte du rappel touché, une seule fois", async () => {
    tapped({ url: "/savings-detail/c1" });

    await renderHook(() => useReminderTap());

    expect(router.push).toHaveBeenCalledWith("/savings-detail/c1");
    expect(Notifications.clearLastNotificationResponse).toHaveBeenCalledTimes(1);
  });

  it("ne navigue pas sans notification touchée", async () => {
    lastResponse.mockReturnValue(null);

    await renderHook(() => useReminderTap());

    expect(router.push).not.toHaveBeenCalled();
  });

  it("ignore une notification sans lien", async () => {
    tapped({});

    await renderHook(() => useReminderTap());

    expect(router.push).not.toHaveBeenCalled();
  });
});
