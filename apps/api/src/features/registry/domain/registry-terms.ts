import { RegistryError } from "./registry.repository.js";

function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new RegistryError("Corps invalide");
  return input as Record<string, unknown>;
}

function count(value: unknown, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max)
    throw new RegistryError("Nombre invalide");
  return value;
}

/**
 * Valide le libellé du groupe.
 * @param input Nom externe.
 * @returns Nom normalisé.
 */
export function readRegistryName(input: unknown): string {
  if (typeof input !== "string" || input.trim().length < 1 || input.trim().length > 80)
    throw new RegistryError("Nom invalide");
  return input.trim();
}

function amount(input: unknown): bigint {
  const money = object(input),
    value = money["amount"];
  if (typeof value !== "string" || !/^[1-9][0-9]{0,9}$/.test(value) || money["currency"] !== "XAF")
    throw new RegistryError("Montant XAF invalide");
  return BigInt(value);
}

function frequency(input: unknown) {
  const data = object(input),
    unit = data["unit"];
  if (typeof unit !== "string" || !["jour", "semaine", "mois"].includes(unit))
    throw new RegistryError("Fréquence invalide");
  return { frequencyUnit: unit, frequencyInterval: count(data["interval"], 1, 365) };
}

/**
 * Valide les paramètres d'un groupe déclaratif gratuit.
 * @param body Conditions externes du groupe.
 * @returns Conditions validées et montant entier.
 */
export function readRegistryTerms(body: unknown) {
  const input = object(body);
  return {
    name: readRegistryName(input["name"]),
    contributionAmount: amount(input["contributionAmount"]),
    participantCount: count(input["participantCount"], 2, 100),
    ...frequency(input["frequency"]),
  };
}
