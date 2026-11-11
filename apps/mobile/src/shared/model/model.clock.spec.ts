import { todayUtc } from "./model.clock";

describe("todayUtc", () => {
  it("donne la date du jour en UTC, sans l'heure", () => {
    expect(todayUtc(new Date("2026-11-11T23:30:00-02:00"))).toBe("2026-11-12");
    expect(todayUtc(new Date("2026-11-11T08:00:00Z"))).toBe("2026-11-11");
  });
});
