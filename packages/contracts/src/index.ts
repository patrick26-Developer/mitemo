/**
 * Contrats partagés entre l'API, le web et le mobile.
 * Seule porte d'entrée du paquet : tout ce qui n'est pas exporté ici est interne.
 */
export type { Brand } from "./brand.ts";
export type { ContributionId, GroupId, MemberId } from "./identifiers.ts";
export { API_ERROR_CODES } from "./api-error.ts";
export type { ApiErrorCode, ApiErrorResponse, ApiFieldError } from "./api-error.ts";
export {
  CURRENCIES,
  InvalidAmountError,
  parseAmount,
  serializeAmount,
  toAmountMinor,
} from "./money.ts";
export type { AmountMinor, Currency, Money, MoneyDto, SerializedAmount } from "./money.ts";
