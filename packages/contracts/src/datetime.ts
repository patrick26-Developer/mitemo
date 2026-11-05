import type { Brand } from "./brand.ts";

/**
 * Date et heure sérialisées pour le réseau : chaîne ISO 8601, toujours en UTC
 * (suffixe `Z`), jamais un fuseau local.
 */
export type IsoDateTime = Brand<string, "IsoDateTime">;

/**
 * Marque une chaîne comme date ISO 8601 UTC.
 * @param value Chaîne déjà au format ISO 8601 UTC (ex. produite par `Date.prototype.toISOString`).
 * @returns La même chaîne, typée `IsoDateTime`.
 */
export function toIsoDateTime(value: string): IsoDateTime {
  return value as IsoDateTime;
}
