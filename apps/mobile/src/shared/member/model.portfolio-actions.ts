import type { SavingsCard, Tontine } from "./model.portfolio";
import { createId, isTontineBeneficiary, SELF_MEMBER_ID, tontinePot } from "./model.portfolio";
import type { CreateCardInput, CreateTontineInput } from "./model.portfolio-create";
import { buildCard, buildTontine } from "./model.portfolio-create";
import {
  ForbiddenOperationError,
  InsufficientFundsError,
  InvalidAmountError,
} from "./model.portfolio-error";
import { INITIAL_PORTFOLIO } from "./model.portfolio-initial";
import {
  addSaved,
  advanceRound,
  clearSaved,
  deductSaved,
  markSelfPaid,
  prependCard,
  prependTontine,
  removeTontineMember,
  requireAdmin,
  requireCard,
  requireFunds,
  requireOtherMember,
  requirePositive,
  requireSelfCanPay,
  requireTontine,
  setInvitationCode,
} from "./model.portfolio-update";

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

/** Paramètres d'un transfert vers un autre membre d'une tontine. */
export interface TransferToMemberInput {
  readonly tontineId: string;
  readonly memberId: string;
  /** Montant strictement positif, en plus petite unité de la devise. */
  readonly amount: bigint;
}

/** État partagé des tontines, des cartes et du solde disponible. */
export interface PortfolioState {
  readonly available: bigint;
  readonly tontines: readonly Tontine[];
  readonly cards: readonly SavingsCard[];
  createTontine: (input: CreateTontineInput) => Tontine;
  createCard: (input: CreateCardInput) => void;
  contributeTontine: (tontineId: string) => void;
  withdrawTontine: (tontineId: string) => void;
  transferToMember: (tontineId: string, memberId: string, amount: bigint) => void;
  inviteMember: (tontineId: string) => string;
  removeMember: (tontineId: string, memberId: string) => void;
  contributeCard: (cardId: string) => void;
  withdrawCard: (cardId: string) => void;
  transferCardToTontine: (cardId: string) => void;
  reset: () => void;
}

/**
 * Code d'invitation court, lisible à voix haute.
 * @returns Le code à partager avec les futurs membres.
 */
function createInvitationCode(): string {
  return createId("invitation")
    .replace(/[^a-z0-9]/gi, "")
    .slice(-6)
    .toUpperCase();
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
  const card = buildCard(input, context.get().cards.length);
  context.set((state) => ({ cards: prependCard(state.cards, card) }));
}

/**
 * Règle la cotisation du membre connecté pour le tour en cours.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @throws {ForbiddenOperationError} si la cotisation est déjà réglée ou interdite.
 * @throws {InsufficientFundsError} si le solde disponible ne couvre pas la cotisation.
 */
function contributeTontine(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireSelfCanPay(tontine);
  requireFunds(context.get().available, tontine.contribution);
  context.set((state) => ({
    available: state.available - tontine.contribution,
    tontines: markSelfPaid(state.tontines, tontineId),
  }));
}

/**
 * Verse la cagnotte du tour au bénéficiaire et passe au tour suivant.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @throws {ForbiddenOperationError} si le membre connecté n'est pas le bénéficiaire.
 */
function withdrawTontine(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  if (!isTontineBeneficiary(tontine)) {
    throw new ForbiddenOperationError("Vous ne recevez pas la cagnotte de ce tour.");
  }
  context.set((state) => ({
    available: state.available + tontinePot(tontine),
    tontines: advanceRound(state.tontines, tontineId),
  }));
}

/**
 * Transfère un montant du solde disponible vers un autre membre de la tontine.
 * @param context Accès au store.
 * @param input Tontine, destinataire et montant.
 */
function transferToMember(context: PortfolioContext, input: TransferToMemberInput): void {
  const tontine = requireTontine(context.get().tontines, input.tontineId);
  requirePositive(input.amount);
  requireFunds(context.get().available, input.amount);
  requireOtherMember(tontine, input.memberId);
  context.set((state) => ({ available: state.available - input.amount }));
}

/**
 * Ouvre ou renvoie le code d'invitation d'une tontine administrée.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @returns Le code d'invitation à partager.
 */
function inviteMember(context: PortfolioContext, tontineId: string): string {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  const code = tontine.invitationCode ?? createInvitationCode();
  context.set((state) => ({ tontines: setInvitationCode(state.tontines, tontineId, code) }));
  return code;
}

/**
 * Retire un membre d'une tontine administrée.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @param memberId Membre à retirer.
 */
function removeMember(context: PortfolioContext, tontineId: string, memberId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  if (memberId === SELF_MEMBER_ID) {
    throw new ForbiddenOperationError("Vous ne pouvez pas vous retirer vous-même.");
  }
  context.set((state) => ({ tontines: removeTontineMember(state.tontines, tontineId, memberId) }));
}

/**
 * Ajoute un marqueur d'épargne à une carte.
 * @param context Accès au store.
 * @param cardId Carte concernée.
 * @throws {ForbiddenOperationError} si la carte est clôturée.
 * @throws {InsufficientFundsError} si le solde disponible ne couvre pas le marqueur.
 */
function contributeCard(context: PortfolioContext, cardId: string): void {
  const card = requireCard(context.get().cards, cardId);
  if (card.state !== "ACTIVE") {
    throw new ForbiddenOperationError("Cette carte est clôturée.");
  }
  requireFunds(context.get().available, card.markerAmount);
  context.set((state) => ({
    available: state.available - card.markerAmount,
    cards: addSaved(state.cards, cardId, card.markerAmount),
  }));
}

/**
 * Verse l'épargne d'une carte sur le solde disponible et clôt la carte.
 * @param context Accès au store.
 * @param cardId Carte concernée.
 * @throws {InvalidAmountError} si la carte n'a aucune épargne.
 */
function withdrawCard(context: PortfolioContext, cardId: string): void {
  const card = requireCard(context.get().cards, cardId);
  if (card.saved <= 0n) throw new InvalidAmountError("Cette carte n'a rien à retirer.");
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
  if (card.saved < tontine.contribution) {
    throw new InsufficientFundsError("L'épargne de la carte ne couvre pas la cotisation.");
  }
  context.set((state) => ({
    cards: deductSaved(state.cards, cardId, tontine.contribution),
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
    contributeTontine: (id) => contributeTontine(context, id),
    withdrawTontine: (id) => withdrawTontine(context, id),
    transferToMember: (tontineId, memberId, amount) =>
      transferToMember(context, { tontineId, memberId, amount }),
    inviteMember: (id) => inviteMember(context, id),
    removeMember: (tontineId, memberId) => removeMember(context, tontineId, memberId),
    contributeCard: (id) => contributeCard(context, id),
    withdrawCard: (id) => withdrawCard(context, id),
    transferCardToTontine: (id) => transferCardToTontine(context, id),
    reset: () => context.set({ ...INITIAL_PORTFOLIO }),
  };
}
