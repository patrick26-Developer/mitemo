import { isSupportCacheFresh } from "./model.support-cache";

/** Numéro mis en cache le 13 novembre 2026 à 8 h UTC, pour une journée. */
const CACHE = {
  phoneNumber: "+242065706622",
  fetchedAt: Date.UTC(2026, 10, 13, 8),
  maxAgeSeconds: 86_400,
};

describe("isSupportCacheFresh", () => {
  it("garde le numéro pendant sa durée de vie", () => {
    expect(isSupportCacheFresh(CACHE, Date.UTC(2026, 10, 14, 7, 59))).toBe(true);
  });

  it("le redemande une fois la durée de vie écoulée", () => {
    expect(isSupportCacheFresh(CACHE, Date.UTC(2026, 10, 14, 8))).toBe(false);
  });

  it("le demande quand rien n'est en cache", () => {
    expect(isSupportCacheFresh(null, Date.UTC(2026, 10, 13, 8))).toBe(false);
  });
});
