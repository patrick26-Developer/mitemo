import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { CardReminder } from "../model/model.card-reminder";
import {
  REMINDER_CHANNEL_ID,
  allowReminders,
  presentReminder,
  reminderUrl,
} from "./notifier.card-reminder";

jest.mock("expo-notifications", () => ({
  AndroidImportance: { HIGH: 4 },
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

/** Rappel de test. */
const REMINDER: CardReminder = {
  id: "card-c1-t1-round-3",
  cardId: "c1",
  title: "Cotisation à verser",
  body: "La cotisation est due.",
};

describe("notifier des rappels de carte", () => {
  const initialPlatform = Platform.OS;

  afterEach(() => {
    (Platform as { OS: string }).OS = initialPlatform;
    jest.clearAllMocks();
  });

  it("ouvre la carte concernée au toucher de la notification", () => {
    expect(reminderUrl(REMINDER)).toBe("/savings-detail/c1");
  });

  it("ne redemande pas l'autorisation quand elle est déjà donnée", async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as never);

    await expect(allowReminders()).resolves.toBe(true);
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("demande l'autorisation et respecte un refus", async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: false } as never);
    jest
      .mocked(Notifications.requestPermissionsAsync)
      .mockResolvedValue({ granted: false } as never);

    await expect(allowReminders()).resolves.toBe(false);
  });

  it("crée le canal des rappels sur Android avant de demander l'autorisation", async () => {
    (Platform as { OS: string }).OS = "android";
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as never);

    await allowReminders();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      REMINDER_CHANNEL_ID,
      expect.objectContaining({ name: "Rappels de cotisation" }),
    );
  });

  it("affiche le rappel tout de suite, avec la carte à ouvrir", async () => {
    await presentReminder(REMINDER);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      identifier: REMINDER.id,
      content: { title: REMINDER.title, body: REMINDER.body, data: { url: "/savings-detail/c1" } },
      trigger: null,
    });
  });

  it("passe par le canal des rappels sur Android", async () => {
    (Platform as { OS: string }).OS = "android";

    await presentReminder(REMINDER);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: { channelId: REMINDER_CHANNEL_ID } }),
    );
  });
});
