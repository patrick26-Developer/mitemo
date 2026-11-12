import { formatRelativeTime } from "./format.relative-time";

/** Instant de référence des tests, en UTC. */
const NOW = "2026-11-12T10:00:00.000Z";

describe("formatRelativeTime", () => {
  it("annonce « À l'instant » pour moins d'une minute", () => {
    expect(formatRelativeTime("2026-11-12T09:59:30.000Z", NOW)).toBe("À l'instant");
  });

  it("compte en minutes, puis en heures, puis en jours", () => {
    expect(formatRelativeTime("2026-11-12T09:35:00.000Z", NOW)).toBe("Il y a 25 min");
    expect(formatRelativeTime("2026-11-12T07:00:00.000Z", NOW)).toBe("Il y a 3 h");
    expect(formatRelativeTime("2026-11-10T10:00:00.000Z", NOW)).toBe("Il y a 2 j");
  });

  it("donne la date au-delà d'une semaine", () => {
    expect(formatRelativeTime("2026-10-01T10:00:00.000Z", NOW)).toBe("01/10/2026");
  });
});
