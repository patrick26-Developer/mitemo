import type { IsoDateTime } from "./datetime.ts";
import type { MovementId, RistourneId, SavingsCardId, TransactionId } from "./identifiers.ts";
import type { MoneyDto } from "./money.ts";
import type { TransactionState } from "./transaction.ts";

/**
 * En-tête qui porte la clé d'idempotence de toute requête qui écrit. Rejouée
 * avec la même clé, la requête renvoie le résultat initial sans second effet.
 */
export const IDEMPOTENCY_KEY_HEADER = "Idempotency-Key";

/**
 * Soldes du portefeuille d'un utilisateur. Aucun de ces nombres n'est stocké
 * ni modifiable : l'API les calcule à chaque lecture à partir du grand livre
 * et des transactions de paiement.
 *
 * - `available` : solde du compte `WALLET_USER` de l'utilisateur. C'est le
 *   seul montant qu'il peut affecter à un programme.
 * - `committed` (affecté) : somme des soldes des caisses de ses cartes de
 *   pointage personnelles. L'argent y est engagé jusqu'à la fin de la carte.
 * - `pending` (en attente) : approvisionnements simulés à l'état `PENDING`.
 *   Ils n'ont encore produit aucune écriture : rien n'est crédité avant
 *   confirmation.
 * - `blocked` (bloqué) : solde de ses comptes de garantie. Il vaut zéro dans
 *   la démonstration, qui ne met en œuvre aucune garantie.
 *
 * Les contributions déjà versées à une ristourne ne figurent dans aucun de
 * ces soldes : elles appartiennent à la caisse collective du groupe.
 */
export interface WalletSummaryResponse {
  readonly available: MoneyDto;
  readonly committed: MoneyDto;
  readonly pending: MoneyDto;
  readonly blocked: MoneyDto;
  /** Toujours `true` : aucun fonds réel sans validation juridique (ADR 0005). */
  readonly simulated: true;
}

/** Natures de programme auxquelles un mouvement peut être rattaché. */
export const PROGRAM_KINDS = ["SAVINGS_CARD", "RISTOURNE"] as const;

/** Nature d'un programme. Voir {@link PROGRAM_KINDS}. */
export type ProgramKind = (typeof PROGRAM_KINDS)[number];

/** Programme concerné par un mouvement. */
export type ProgramRef =
  | { readonly kind: "SAVINGS_CARD"; readonly id: SavingsCardId }
  | { readonly kind: "RISTOURNE"; readonly id: RistourneId };

/** Natures des mouvements affichés dans l'historique du portefeuille. */
export const MOVEMENT_KINDS = [
  "FUNDING",
  "SAVINGS_INSTALLMENT",
  "SAVINGS_PAYOUT",
  "RISTOURNE_CONTRIBUTION",
  "RISTOURNE_PAYOUT",
  "FEE",
  "REVERSAL",
] as const;

/** Nature d'un mouvement. Voir {@link MOVEMENT_KINDS}. */
export type MovementKind = (typeof MOVEMENT_KINDS)[number];

/** Ligne de l'historique du portefeuille, issue d'une écriture du grand livre. */
export interface WalletMovement {
  readonly movementId: MovementId;
  readonly occurredAt: IsoDateTime;
  readonly kind: MovementKind;
  /** Montant signé, vu du solde disponible : positif en entrée, négatif en sortie. */
  readonly amount: MoneyDto;
  readonly description: string;
  /** `true` pour toute opération simulée, à signaler comme telle à l'écran. */
  readonly simulated: boolean;
  readonly program?: ProgramRef;
}

/** Page de l'historique, du plus récent au plus ancien. */
export interface WalletMovementsResponse {
  readonly items: readonly WalletMovement[];
  /** Curseur de la page suivante ; absent sur la dernière page. */
  readonly nextCursor?: string;
}

/**
 * Demande d'approvisionnement simulé du portefeuille. La requête porte
 * l'en-tête {@link IDEMPOTENCY_KEY_HEADER}.
 */
export interface SimulateFundingRequest {
  /** Montant strictement positif, en FCFA entiers. */
  readonly amount: MoneyDto;
}

/**
 * Approvisionnement simulé créé. Il apparaît d'abord dans `pending` ; le solde
 * disponible n'augmente qu'au passage à `CONFIRMED`.
 */
export interface SimulateFundingResponse {
  readonly transactionId: TransactionId;
  readonly state: TransactionState;
  readonly amount: MoneyDto;
  readonly simulated: true;
  readonly createdAt: IsoDateTime;
}
