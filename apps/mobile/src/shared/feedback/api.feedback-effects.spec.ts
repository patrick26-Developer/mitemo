import { notificationAsync } from "expo-haptics";

import { playFeedbackSound, playSuccessHaptic } from "./api.feedback-effects";

/** Lecteur simulé, qui retient ses lectures. */
interface FakePlayer {
  readonly source: unknown;
  volume: number;
  readonly play: jest.Mock;
  readonly seekTo: jest.Mock;
}

/** Lecteurs créés pendant les tests, dans l'ordre. */
const mockPlayers: FakePlayer[] = [];

jest.mock("expo-audio", () => ({
  createAudioPlayer: (source: unknown) => {
    const player = { source, volume: 1, play: jest.fn(), seekTo: jest.fn(async () => undefined) };
    mockPlayers.push(player);
    return player;
  },
}));

jest.mock("expo-haptics", () => ({
  NotificationFeedbackType: { Success: "success" },
  notificationAsync: jest.fn(async () => undefined),
}));

describe("playFeedbackSound", () => {
  it("joue le son demandé depuis le début, en réutilisant son lecteur", async () => {
    await playFeedbackSound("success");
    await playFeedbackSound("success");

    expect(mockPlayers).toHaveLength(1);
    expect(mockPlayers[0]?.volume).toBeLessThan(1);
    expect(mockPlayers[0]?.seekTo).toHaveBeenCalledWith(0);
    expect(mockPlayers[0]?.play).toHaveBeenCalledTimes(2);
  });

  it("ne bloque pas l'application quand la lecture échoue", async () => {
    await playFeedbackSound("coin");
    const coin = mockPlayers.at(-1);
    coin?.seekTo.mockRejectedValueOnce(new Error("audio indisponible"));

    await expect(playFeedbackSound("coin")).resolves.toBe(false);
  });
});

describe("playSuccessHaptic", () => {
  it("joue le retour haptique de réussite du système", async () => {
    await expect(playSuccessHaptic()).resolves.toBe(true);

    expect(notificationAsync).toHaveBeenCalledWith("success");
  });

  it("ne bloque pas l'application sans moteur de vibration", async () => {
    jest.mocked(notificationAsync).mockRejectedValueOnce(new Error("indisponible"));

    await expect(playSuccessHaptic()).resolves.toBe(false);
  });
});
