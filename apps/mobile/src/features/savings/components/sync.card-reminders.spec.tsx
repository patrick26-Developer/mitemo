import { render } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";

import { useCardReminders } from "../hooks/hook.card-reminders";
import { useReminderTap } from "../hooks/hook.reminder-tap";
import { CardReminders } from "./sync.card-reminders";

jest.mock("expo-notifications", () => ({ setNotificationHandler: jest.fn() }));
jest.mock("../hooks/hook.card-reminders", () => ({ useCardReminders: jest.fn() }));
jest.mock("../hooks/hook.reminder-tap", () => ({ useReminderTap: jest.fn() }));

describe("CardReminders", () => {
  it("affiche les rappels en bannière même quand l'app est ouverte", async () => {
    await render(<CardReminders />);
    const handler = jest.mocked(Notifications.setNotificationHandler).mock.calls[0]?.[0];

    await expect(handler?.handleNotification({} as never)).resolves.toMatchObject({
      shouldShowBanner: true,
      shouldPlaySound: true,
    });
  });

  it("surveille les rappels et le toucher sans rien afficher", async () => {
    const view = await render(<CardReminders />);

    expect(useCardReminders).toHaveBeenCalled();
    expect(useReminderTap).toHaveBeenCalled();
    expect(view.toJSON()).toBeNull();
  });
});
