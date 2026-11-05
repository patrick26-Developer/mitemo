import type { Brand } from "./brand.ts";

/** Devises acceptées. Le pilote ne traite que le franc CFA d'Afrique centrale. */
export const CURRENCIES = ["XAF"] as const;

/** Code ISO 4217 d'une devise acceptée. */
export type Currency = (typeof CURRENCIES)[number];

/** Montant dans la plus petite unité de la devise (1 XAF = 1). Jamais de flottant. */
export type AmountMinor = Brand<bigint, "AmountMinor">;

/** Montant sérialisé pour le JSON : entier signé en base 10, sans signe « + » ni zéro initial. */
export type SerializedAmount = Brand<string, "SerializedAmount">;

/** Montant manipulé dans le code, côté API comme côté clients. */
export interface Money {
  readonly amount: AmountMinor;
  readonly currency: Currency;
}

/** Montant tel qu'il circule entre l'API et les clients (le JSON ne connaît pas `bigint`). */
export interface MoneyDto {
  readonly amount: SerializedAmount;
  readonly currency: Currency;
}

const CANONICAL_INTEGER = /^(0|-?[1-9]\d*)$/;

/** Levée quand une chaîne reçue ne représente pas un montant entier canonique. */
export class InvalidAmountError extends Error {
  override readonly name = "InvalidAmountError";
  readonly raw: string;

  /**
   * Construit l'erreur.
   * @param raw Valeur reçue, conservée pour le diagnostic.
   */
  constructor(raw: string) {
    super(`Montant invalide : ${JSON.stringify(raw)}`);
    this.raw = raw;
  }
}

/**
 * Marque un entier comme montant en plus petite unité.
 * @param value Entier déjà exprimé en plus petite unité.
 * @returns Le même entier, typé `AmountMinor`.
 */
export function toAmountMinor(value: bigint): AmountMinor {
  return value as AmountMinor;
}

/**
 * Lit un montant reçu en JSON, sans aucune perte de précision.
 * @param raw Chaîne d'entier canonique, par exemple « -1500 ».
 * @returns Le montant typé.
 * @throws {InvalidAmountError} si la chaîne n'est pas un entier canonique.
 */
export function parseAmount(raw: string): AmountMinor {
  if (!CANONICAL_INTEGER.test(raw)) throw new InvalidAmountError(raw);
  return BigInt(raw) as AmountMinor;
}

/**
 * Prépare un montant pour le JSON.
 * @param amount Montant typé.
 * @returns La forme canonique lisible par `parseAmount`.
 */
export function serializeAmount(amount: AmountMinor): SerializedAmount {
  return amount.toString() as SerializedAmount;
}
