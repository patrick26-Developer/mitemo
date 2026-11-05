import type { IsoDateTime } from "./datetime.ts";
import type { MemberId, TransactionId } from "./identifiers.ts";
import type { MoneyDto } from "./money.ts";

/**
 * États de l'automate de transaction (`docs/audit/03-architecture-technique.md`,
 * §2, automate 4). Le portefeuille n'est jamais crédité sur un simple code 200 :
 * seul le passage à `CONFIRMED` (rappel signé de l'opérateur ou interrogation
 * d'état réussie) déclenche le crédit. Une correction est une contre-écriture
 * (`REVERSED`), jamais une suppression.
 */
export const TRANSACTION_STATES = [
  "INITIATED",
  "PENDING",
  "CONFIRMED",
  "FAILED",
  "EXPIRED",
  "REVERSED",
] as const;

/** État de l'automate de transaction. Voir {@link TRANSACTION_STATES}. */
export type TransactionState = (typeof TRANSACTION_STATES)[number];

/** Demande d'approvisionnement du portefeuille d'un membre. */
export interface FundWalletRequest {
  readonly memberId: MemberId;
  readonly amount: MoneyDto;
}

/**
 * Transaction d'approvisionnement créée. `state` vaut toujours `INITIATED` à
 * la création : le client ne doit jamais afficher le dépôt comme réussi avant
 * un passage ultérieur à `CONFIRMED`.
 */
export interface FundWalletResponse {
  readonly transactionId: TransactionId;
  readonly state: TransactionState;
  readonly amount: MoneyDto;
  readonly createdAt: IsoDateTime;
}
