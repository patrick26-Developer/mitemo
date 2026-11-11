import type { CardEntry, SavingsCard, Tontine, TontineMember } from "./model.portfolio";
import { cardGoal, SELF_MEMBER_ID } from "./model.portfolio";
import {
  ForbiddenOperationError,
  InsufficientFundsError,
  InvalidAmountError,
  UnknownEntityError,
} from "./model.portfolio-error";

/**
 * Retrouve le membre connecté dans une tontine.
 * @param tontine Tontine concernée.
 * @returns Son adhésion, ou `undefined` s'il n'y participe pas.
 */
export function findSelfMember(tontine: Tontine): TontineMember | undefined {
  return tontine.members.find((member) => member.id === SELF_MEMBER_ID);
}

/**
 * Retrouve une tontine par son identifiant.
 * @param tontines Tontines du membre.
 * @param id Identifiant recherché.
 * @returns La tontine trouvée.
 * @throws {UnknownEntityError} si aucune tontine ne porte cet identifiant.
 */
export function requireTontine(tontines: readonly Tontine[], id: string): Tontine {
  const tontine = tontines.find((item) => item.id === id);
  if (tontine === undefined) throw new UnknownEntityError(`Tontine inconnue : ${id}.`);

  return tontine;
}

/**
 * Retrouve une carte par son identifiant.
 * @param cards Cartes du membre.
 * @param id Identifiant recherché.
 * @returns La carte trouvée.
 * @throws {UnknownEntityError} si aucune carte ne porte cet identifiant.
 */
export function requireCard(cards: readonly SavingsCard[], id: string): SavingsCard {
  const card = cards.find((item) => item.id === id);
  if (card === undefined) throw new UnknownEntityError(`Carte inconnue : ${id}.`);

  return card;
}

/**
 * Refuse un montant nul ou négatif.
 * @param amount Montant à vérifier.
 * @throws {InvalidAmountError} si le montant n'est pas strictement positif.
 */
export function requirePositive(amount: bigint): void {
  if (amount <= 0n) throw new InvalidAmountError("Le montant doit être strictement positif.");
}

/**
 * Refuse une opération que le solde disponible ne couvre pas.
 * @param available Solde disponible, en plus petite unité de la devise.
 * @param amount Montant demandé.
 * @throws {InsufficientFundsError} si le solde est insuffisant.
 */
export function requireFunds(available: bigint, amount: bigint): void {
  if (available < amount)
    throw new InsufficientFundsError("Votre solde disponible est insuffisant.");
}

/**
 * Vérifie que le membre connecté peut régler sa cotisation du tour en cours.
 * @param tontine Tontine concernée.
 * @throws {ForbiddenOperationError} s'il ne participe pas, a déjà payé, ou si la tontine est close.
 */
export function requireSelfCanPay(tontine: Tontine): void {
  const member = findSelfMember(tontine);
  if (tontine.state !== "ACTIVE") {
    throw new ForbiddenOperationError("Cette tontine est terminée.");
  }
  if (member === undefined) {
    throw new ForbiddenOperationError("Vous ne participez pas à cette tontine.");
  }
  if (member.paidCurrentRound) {
    throw new ForbiddenOperationError("Votre cotisation est déjà réglée.");
  }
}

/**
 * Vérifie que le membre connecté administre la tontine.
 * @param tontine Tontine concernée.
 * @throws {ForbiddenOperationError} s'il n'en est pas l'administrateur.
 */
export function requireAdmin(tontine: Tontine): void {
  if (findSelfMember(tontine)?.role !== "ADMIN") {
    throw new ForbiddenOperationError("Seul l'administrateur peut effectuer cette action.");
  }
}

/**
 * Vérifie que le destinataire d'un transfert est bien un autre membre.
 * @param tontine Tontine concernée.
 * @param memberId Destinataire demandé.
 * @throws {ForbiddenOperationError} si le destinataire est le membre connecté.
 * @throws {UnknownEntityError} si le destinataire n'appartient pas à la tontine.
 */
export function requireOtherMember(tontine: Tontine, memberId: string): void {
  if (memberId === SELF_MEMBER_ID) {
    throw new ForbiddenOperationError("Choisissez un autre membre que vous.");
  }
  if (!tontine.members.some((member) => member.id === memberId)) {
    throw new UnknownEntityError(`Membre inconnu : ${memberId}.`);
  }
}

/**
 * Marque la cotisation du membre connecté comme réglée pour le tour en cours.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @returns La liste avec la cotisation réglée.
 */
export function markSelfPaid(tontines: readonly Tontine[], id: string): readonly Tontine[] {
  return tontines.map((tontine) => {
    if (tontine.id !== id) return tontine;

    const members = tontine.members.map((member) =>
      member.id === SELF_MEMBER_ID ? { ...member, paidCurrentRound: true } : member,
    );
    return { ...tontine, members };
  });
}

/**
 * Désigne le bénéficiaire suivant dans l'ordre des membres.
 * @param tontine Tontine concernée.
 * @returns L'identifiant du bénéficiaire suivant.
 */
function nextBeneficiaryId(tontine: Tontine): string {
  const index = tontine.members.findIndex((member) => member.id === tontine.beneficiaryId);
  return tontine.members[(index + 1) % tontine.members.length]?.id ?? SELF_MEMBER_ID;
}

/**
 * Ajoute un membre à une tontine préparée.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @param member Membre à inscrire.
 * @returns La liste avec le membre ajouté.
 */
export function appendTontineMember(
  tontines: readonly Tontine[],
  id: string,
  member: TontineMember,
): readonly Tontine[] {
  return tontines.map((tontine) =>
    tontine.id === id ? { ...tontine, members: [...tontine.members, member] } : tontine,
  );
}

/**
 * Lance une tontine préparée : premier tour ouvert, premier membre bénéficiaire.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @returns La liste avec la tontine lancée.
 */
export function startTontine(tontines: readonly Tontine[], id: string): readonly Tontine[] {
  return tontines.map((tontine) => {
    if (tontine.id !== id) return tontine;

    const members = tontine.members.map((member) => ({ ...member, paidCurrentRound: false }));
    return {
      ...tontine,
      round: 1,
      state: "ACTIVE",
      beneficiaryId: members[0]?.id ?? SELF_MEMBER_ID,
      members,
    };
  });
}

/**
 * Passe au tour suivant et remet les cotisations à zéro, ou clôt la tontine.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @returns La liste avec le tour avancé.
 */
export function advanceRound(tontines: readonly Tontine[], id: string): readonly Tontine[] {
  return tontines.map((tontine) => {
    if (tontine.id !== id) return tontine;
    if (tontine.round >= tontine.totalRounds) return { ...tontine, state: "COMPLETED" };

    const members = tontine.members.map((member) => ({ ...member, paidCurrentRound: false }));
    return {
      ...tontine,
      round: tontine.round + 1,
      beneficiaryId: nextBeneficiaryId(tontine),
      members,
    };
  });
}

/**
 * Retire un membre d'une tontine et repasse la cagnotte au suivant s'il en était bénéficiaire.
 * @param tontines Tontines du membre.
 * @param tontineId Tontine concernée.
 * @param memberId Membre à retirer.
 * @returns La liste avec le membre retiré.
 */
export function removeTontineMember(
  tontines: readonly Tontine[],
  tontineId: string,
  memberId: string,
): readonly Tontine[] {
  return tontines.map((tontine) => {
    if (tontine.id !== tontineId) return tontine;

    const members = tontine.members.filter((member) => member.id !== memberId);
    const beneficiaryId =
      tontine.beneficiaryId === memberId
        ? (members[0]?.id ?? SELF_MEMBER_ID)
        : tontine.beneficiaryId;
    return { ...tontine, members, beneficiaryId };
  });
}

/**
 * Enregistre le code d'invitation d'une tontine.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @param code Code à enregistrer.
 * @returns La liste avec le code.
 */
export function setInvitationCode(
  tontines: readonly Tontine[],
  id: string,
  code: string,
): readonly Tontine[] {
  return tontines.map((tontine) =>
    tontine.id === id ? { ...tontine, invitationCode: code } : tontine,
  );
}

/**
 * Ajoute une tontine en tête de liste.
 * @param tontines Tontines du membre.
 * @param tontine Nouvelle tontine.
 * @returns La liste avec la tontine ajoutée.
 */
export function prependTontine(tontines: readonly Tontine[], tontine: Tontine): readonly Tontine[] {
  return [tontine, ...tontines];
}

/**
 * Ajoute un pointage à l'épargne d'une carte et l'inscrit dans son historique ;
 * la carte se clôt quand l'objectif est atteint.
 * @param cards Cartes du membre.
 * @param id Carte concernée.
 * @param entry Pointage à inscrire, avec son instant et son montant.
 * @returns Les cartes à jour.
 */
export function addSaved(
  cards: readonly SavingsCard[],
  id: string,
  entry: CardEntry,
): readonly SavingsCard[] {
  return cards.map((card) => {
    if (card.id !== id) return card;

    const saved = card.saved + entry.amount;
    const state = saved >= cardGoal(card) ? "COMPLETED" : card.state;
    return { ...card, saved, state, entries: [...card.entries, entry] };
  });
}

/**
 * Retire un montant de l'épargne d'une carte.
 * @param cards Cartes du membre.
 * @param id Carte concernée.
 * @param amount Montant à retirer.
 * @returns La liste avec l'épargne mise à jour.
 */
export function deductSaved(
  cards: readonly SavingsCard[],
  id: string,
  amount: bigint,
): readonly SavingsCard[] {
  return cards.map((card) => (card.id === id ? { ...card, saved: card.saved - amount } : card));
}

/**
 * Archive une carte dont l'épargne vient d'être retirée. Le montant épargné
 * reste inscrit pour l'historique, mais ne compte plus dans le total.
 * @param cards Cartes du membre.
 * @param id Carte concernée.
 * @returns La liste avec la carte archivée.
 */
export function clearSaved(cards: readonly SavingsCard[], id: string): readonly SavingsCard[] {
  return cards.map((card) => (card.id === id ? { ...card, state: "ARCHIVED" } : card));
}

/**
 * Ajoute une carte en tête de liste.
 * @param cards Cartes du membre.
 * @param card Nouvelle carte.
 * @returns La liste avec la carte ajoutée.
 */
export function prependCard(
  cards: readonly SavingsCard[],
  card: SavingsCard,
): readonly SavingsCard[] {
  return [card, ...cards];
}
