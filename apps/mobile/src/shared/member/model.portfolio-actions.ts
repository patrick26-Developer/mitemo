import type { ReceivedInvitation } from "./model.invitation";
import type { CardPayment, SavingsCard, Tontine } from "./model.portfolio";
import {
  allMembersPaid,
  cardCapabilities,
  hasReachedQuota,
  SELF_MEMBER_ID,
  tontinePot,
} from "./model.portfolio";
import type { CreateCardInput, CreateTontineInput, MemberContact } from "./model.portfolio-create";
import { buildCard, buildTontine } from "./model.portfolio-create";
import {
  ForbiddenOperationError,
  InsufficientFundsError,
  InvalidAmountError,
} from "./model.portfolio-error";
import { INITIAL_PORTFOLIO } from "./model.portfolio-initial";
import {
  acceptInvitation,
  cancelInvitation,
  declineInvitation,
  inviteContact,
} from "./model.portfolio-invitations";
import {
  addSaved,
  advanceRound,
  clearSaved,
  deductSaved,
  markSelfPaid,
  prependCard,
  prependTontine,
  requireAdmin,
  requireCard,
  requireFunds,
  requireSelfCanPay,
  requireTontine,
  startTontine as startTontineIn,
} from "./model.portfolio-update";
import { selfDue } from "./model.tontine-turns";
import type { TontineSettings } from "./model.tontine-settings";
import { adminActions } from "./model.portfolio-admin";
import { walletActions } from "./model.portfolio-wallet";
import { canPayAhead, markSelfPaidAhead } from "./model.tontine-prepay";

/** Mise à jour partielle de l'état du portefeuille. */
export type PortfolioUpdate =
  Partial<PortfolioState> | ((state: PortfolioState) => Partial<PortfolioState>);

/** Écriture d'une mise à jour dans le store. */
export type PortfolioSet = (update: PortfolioUpdate) => void;

/** Accès en lecture et en écriture dont disposent les opérations du portefeuille. */
export interface PortfolioContext {
  readonly get: () => PortfolioState;
  readonly set: PortfolioSet;
}

/** État partagé des tontines, des cartes et du solde disponible. */
export interface PortfolioState {
  readonly available: bigint;
  readonly tontines: readonly Tontine[];
  readonly cards: readonly SavingsCard[];
  /** Invitations reçues par le membre connecté, en attente de sa réponse. */
  readonly invitations: readonly ReceivedInvitation[];
  createTontine: (input: CreateTontineInput) => Tontine;
  createCard: (input: CreateCardInput) => void;
  startTontine: (tontineId: string) => void;
  contributeTontine: (tontineId: string) => void;
  confirmRound: (tontineId: string) => void;
  /** Invite un contact du répertoire qui a un compte Mitemo ; il devient membre en acceptant. */
  inviteContact: (tontineId: string, contact: MemberContact) => void;
  cancelInvitation: (tontineId: string, invitationId: string) => void;
  /** Rejoint la tontine d'une invitation reçue, avec le nombre de tours choisi. */
  acceptInvitation: (invitationId: string, turns: number) => void;
  declineInvitation: (invitationId: string) => void;
  inviteMember: (tontineId: string) => string;
  removeMember: (tontineId: string, memberId: string) => void;
  /** Change le nom, la couleur et, avant le lancement, les règles d'une tontine. */
  updateTontineSettings: (tontineId: string, settings: TontineSettings) => void;
  /** Pointe un marqueur, payé par l'opérateur choisi. */
  contributeCard: (cardId: string, payment: CardPayment) => void;
  withdrawCard: (cardId: string) => void;
  /** Retire une partie du solde disponible vers l'opérateur mobile du membre. */
  withdrawAvailable: (amount: bigint) => void;
  transferCardToTontine: (cardId: string) => void;
  reset: () => void;
}

/**
 * Crée une tontine et l'ajoute en tête de liste.
 * @param context Accès au store.
 * @param input Paramètres saisis.
 * @returns La tontine créée, telle qu'elle est conservée.
 */
function createTontine(context: PortfolioContext, input: CreateTontineInput): Tontine {
  const tontine = buildTontine(input, context.get().tontines.length);
  context.set((state) => ({ tontines: prependTontine(state.tontines, tontine) }));

  return tontine;
}

/**
 * Crée une carte de pointage et l'ajoute en tête de liste.
 * @param context Accès au store.
 * @param input Paramètres saisis.
 */
function createCard(context: PortfolioContext, input: CreateCardInput): void {
  const card = buildCard(input);
  context.set((state) => ({ cards: prependCard(state.cards, card) }));
}

/**
 * Règle la cotisation du membre connecté pour le tour en cours, ou le tour
 * suivant d'avance quand celui-ci est déjà réglé, payée par son opérateur mobile : l'argent vient de Mobile Money ou d'Airtel Money, le solde
 * de l'app n'est pas touché.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @throws {ForbiddenOperationError} si la cotisation est déjà réglée ou interdite.
 */
function contributeTontine(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  if (canPayAhead(tontine)) {
    context.set((state) => ({ tontines: markSelfPaidAhead(state.tontines, tontineId) }));
    return;
  }
  requireSelfCanPay(tontine);
  context.set((state) => ({ tontines: markSelfPaid(state.tontines, tontineId) }));
}

/**
 * Lance une tontine préparée, une fois tous ses membres réunis.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @throws {ForbiddenOperationError} si le membre connecté n'administre pas la tontine.
 * @throws {ForbiddenOperationError} si la tontine est déjà lancée ou incomplète.
 */
function startTontine(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  if (tontine.state !== "PENDING") {
    throw new ForbiddenOperationError("Cette tontine est déjà lancée.");
  }
  if (!hasReachedQuota(tontine)) {
    throw new ForbiddenOperationError("La tontine n'a pas encore tous ses membres.");
  }
  context.set((state) => ({ tontines: startTontineIn(state.tontines, tontineId) }));
}

/**
 * Confirme la restourne : la cagnotte est distribuée au bénéficiaire et le tour
 * passe au suivant, sans action de retrait ni de transfert.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @throws {ForbiddenOperationError} si le membre connecté n'administre pas la tontine.
 * @throws {ForbiddenOperationError} si tous les membres n'ont pas encore versé.
 */
function confirmRound(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  if (tontine.state !== "ACTIVE" || !allMembersPaid(tontine)) {
    throw new ForbiddenOperationError("Tous les membres n'ont pas encore versé leur cotisation.");
  }
  const toSelf = tontine.beneficiaryId === SELF_MEMBER_ID;
  const pot = tontinePot(tontine);
  context.set((state) => ({
    available: toSelf ? state.available + pot : state.available,
    tontines: advanceRound(state.tontines, tontineId),
  }));
}

/**
 * Ajoute un marqueur d'épargne à une carte et l'inscrit dans son historique.
 * @param context Accès au store.
 * @param cardId Carte concernée.
 * @param payment Instant du pointage et opérateur qui l'a réglé.
 * @throws {ForbiddenOperationError} si la carte est clôturée.
 * @throws {InsufficientFundsError} si, payé depuis Mitemo, le solde ne couvre pas le marqueur.
 */
function contributeCard(context: PortfolioContext, cardId: string, payment: CardPayment): void {
  const card = requireCard(context.get().cards, cardId);
  if (card.state !== "ACTIVE") {
    throw new ForbiddenOperationError("Cette carte est clôturée.");
  }
  const debit = payment.method === "MITEMO" ? card.markerAmount : 0n;
  requireFunds(context.get().available, debit);
  context.set((state) => ({
    available: state.available - debit,
    cards: addSaved(state.cards, cardId, { ...payment, amount: card.markerAmount }),
  }));
}

/**
 * Verse l'épargne d'une carte remplie sur le solde disponible et archive la
 * carte : une carte archivée est terminée et retirée.
 * @param context Accès au store.
 * @param cardId Carte concernée.
 * @throws {InvalidAmountError} si la carte n'a aucune épargne.
 * @throws {ForbiddenOperationError} si l'objectif n'est pas atteint ou la carte déjà archivée.
 */
function withdrawCard(context: PortfolioContext, cardId: string): void {
  const card = requireCard(context.get().cards, cardId);
  if (card.saved <= 0n) throw new InvalidAmountError("Cette carte n'a rien à retirer.");
  if (!cardCapabilities(card).canWithdraw) {
    throw new ForbiddenOperationError("Le retrait n'est possible qu'une fois l'objectif atteint.");
  }
  context.set((state) => ({
    available: state.available + card.saved,
    cards: clearSaved(state.cards, cardId),
  }));
}

/**
 * Règle la cotisation de la tontine rattachée avec l'épargne de la carte.
 * @param context Accès au store.
 * @param cardId Carte rattachée.
 * @throws {ForbiddenOperationError} si la carte n'est rattachée à aucune tontine.
 * @throws {InsufficientFundsError} si l'épargne ne couvre pas la cotisation.
 */
function transferCardToTontine(context: PortfolioContext, cardId: string): void {
  const card = requireCard(context.get().cards, cardId);
  if (card.tontineId === null) {
    throw new ForbiddenOperationError("Cette carte n'est liée à aucune tontine.");
  }
  const tontine = requireTontine(context.get().tontines, card.tontineId);
  requireSelfCanPay(tontine);
  const due = selfDue(tontine);
  if (card.saved < due) {
    throw new InsufficientFundsError("L'épargne de la carte ne couvre pas la cotisation.");
  }
  context.set((state) => ({
    cards: deductSaved(state.cards, cardId, due),
    tontines: markSelfPaid(state.tontines, tontine.id),
  }));
}

/**
 * Assemble les opérations du portefeuille autour du store.
 * @param context Accès en lecture et en écriture au store.
 * @returns L'état initial et les opérations prêtes à être exposées.
 */
export function createPortfolioActions(context: PortfolioContext): PortfolioState {
  return {
    ...INITIAL_PORTFOLIO,
    createTontine: (input) => createTontine(context, input),
    createCard: (input) => createCard(context, input),
    startTontine: (id) => startTontine(context, id),
    contributeTontine: (id) => contributeTontine(context, id),
    confirmRound: (id) => confirmRound(context, id),
    inviteContact: (id, contact) => inviteContact(context, id, contact),
    cancelInvitation: (id, invitationId) => cancelInvitation(context, id, invitationId),
    acceptInvitation: (id, turns) => acceptInvitation(context, id, turns),
    declineInvitation: (id) => declineInvitation(context, id),
    ...adminActions(context),
    ...walletActions(context),
    contributeCard: (id, payment) => contributeCard(context, id, payment),
    withdrawCard: (id) => withdrawCard(context, id),
    transferCardToTontine: (id) => transferCardToTontine(context, id),
    reset: () => context.set({ ...INITIAL_PORTFOLIO }),
  };
}
