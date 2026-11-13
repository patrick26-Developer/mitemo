import {
  AUTO_LOCK_CHOICES,
  DEFAULT_AUTO_LOCK_MINUTES,
  autoLockGroups,
  autoLockLabel,
  autoLockMinutesOf,
  isIdleTooLong,
} from "./model.auto-lock";

describe("isIdleTooLong", () => {
  const START = Date.parse("2026-11-13T09:00:00.000Z");

  it("verrouille après la durée d'inactivité choisie", () => {
    expect(isIdleTooLong({ lastActivity: START, now: START + 4 * 60_000, minutes: 5 })).toBe(false);
    expect(isIdleTooLong({ lastActivity: START, now: START + 5 * 60_000, minutes: 5 })).toBe(true);
  });
});

describe("AUTO_LOCK_CHOICES", () => {
  it("propose 5 minutes par défaut, parmi des durées courtes", () => {
    expect(DEFAULT_AUTO_LOCK_MINUTES).toBe(5);
    expect(AUTO_LOCK_CHOICES).toEqual([1, 5, 15, 30]);
    expect(autoLockLabel(1)).toBe("Après 1 minute");
    expect(autoLockLabel(15)).toBe("Après 15 minutes");
  });
});

describe("autoLockGroups", () => {
  it("propose chaque durée dans la liste, et la retrouve au choix", () => {
    expect(autoLockGroups()[0]?.options.map((option) => option.label)).toEqual([
      "Après 1 minute",
      "Après 5 minutes",
      "Après 15 minutes",
      "Après 30 minutes",
    ]);
    expect(autoLockMinutesOf("15")).toBe(15);
    expect(autoLockMinutesOf("7")).toBe(5);
  });
});
