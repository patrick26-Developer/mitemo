import { describe, expect, it } from "vitest";
import { readRegistryTerms, readRegistryName } from "./registry-terms.js";
import { registryId } from "./registry-id.js";
import { RegistryError } from "./registry.repository.js";

const body = {
  name: " Marché solidaire ",
  contributionAmount: { amount: "2000", currency: "XAF" },
  participantCount: 2,
  frequency: { unit: "semaine", interval: 1 },
};
describe("règles du registre gratuit", () => {
  it("valide les unités entières et les conditions existantes de tontine", () => {
    expect(readRegistryTerms(body)).toEqual({
      name: "Marché solidaire",
      contributionAmount: 2000n,
      participantCount: 2,
      frequencyUnit: "semaine",
      frequencyInterval: 1,
    });
    for (const unit of ["jour", "semaine", "mois"])
      expect(readRegistryTerms({ ...body, frequency: { unit, interval: 2 } }).frequencyUnit).toBe(
        unit,
      );
  });
  it("refuse les montants négatifs, flottants ou dans une autre devise", () => {
    for (const amount of ["0", "-500", "0.5", "NaN", 500, undefined, "10000000000"]) {
      expect(() =>
        readRegistryTerms({ ...body, contributionAmount: { amount, currency: "XAF" } }),
      ).toThrow(RegistryError);
    }
    expect(() =>
      readRegistryTerms({ ...body, contributionAmount: { amount: "2000", currency: "EUR" } }),
    ).toThrow(RegistryError);
  });
  it("borne les fréquences, le nombre de membres et le nom", () => {
    for (const participantCount of [1, 101, 2.5, "2", null])
      expect(() => readRegistryTerms({ ...body, participantCount })).toThrow(RegistryError);
    for (const interval of [0, 366, 1.5, "2"])
      expect(() => readRegistryTerms({ ...body, frequency: { unit: "jour", interval } })).toThrow(
        RegistryError,
      );
    for (const unit of ["annuel", null, 5])
      expect(() => readRegistryTerms({ ...body, frequency: { unit, interval: 1 } })).toThrow(
        RegistryError,
      );
    for (const name of ["", " ".repeat(4), "A".repeat(81), null, 5])
      expect(() => readRegistryName(name)).toThrow(RegistryError);
  });
  it("refuse les corps non objets et les identifiants invalides", () => {
    for (const data of [null, [], undefined, "2000"])
      expect(() => readRegistryTerms(data)).toThrow(RegistryError);
    expect(() => readRegistryTerms({ ...body, frequency: null })).toThrow(RegistryError);
    expect(() => readRegistryTerms({ ...body, contributionAmount: [] })).toThrow(RegistryError);
    for (const value of [null, "../other", 4])
      expect(() => registryId(value)).toThrow(RegistryError);
    const id = "9efc1ae1-f27e-49e5-a97b-a04a580cff1e";
    expect(registryId(id)).toBe(id);
    expect(new RegistryError("Accès", true).inaccessible).toBe(true);
  });
});
