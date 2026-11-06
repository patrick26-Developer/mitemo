import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  ContributionId,
  GroupId,
  InvitationToken,
  LoginChallengeId,
  MemberId,
  MovementId,
  RistourneId,
  RoundId,
  SavingsCardId,
  TontineId,
  TransactionId,
  UserId,
} from "./identifiers.ts";

/**
 * Deux identifiants brandés sur le même type primitif (`string`) ne doivent
 * jamais être interchangeables, même si leur valeur se ressemble. C'est le
 * critère d'acceptation explicite de l'issue #5 : un `GroupId` à la place
 * d'un `MemberId` ne doit pas compiler.
 */
describe("identifiants nominaux", () => {
  it("un GroupId n'est pas accepté là où un MemberId est attendu", () => {
    const groupId = "0" as GroupId;

    // @ts-expect-error un GroupId n'est pas un MemberId, même si les deux sont des string
    const memberId: MemberId = groupId;

    assert.equal(typeof memberId, "string");
  });

  it("un TontineId n'est pas accepté là où un RoundId est attendu", () => {
    const tontineId = "0" as TontineId;

    // @ts-expect-error un TontineId n'est pas un RoundId
    const roundId: RoundId = tontineId;

    assert.equal(typeof roundId, "string");
  });

  it("un TransactionId n'est pas accepté là où une ContributionId est attendue", () => {
    const transactionId = "0" as TransactionId;

    // @ts-expect-error un TransactionId n'est pas une ContributionId
    const contributionId: ContributionId = transactionId;

    assert.equal(typeof contributionId, "string");
  });

  it("une chaîne brute n'est pas acceptée comme InvitationToken", () => {
    // @ts-expect-error une chaîne brute n'a pas la marque InvitationToken
    const token: InvitationToken = "une-chaine-quelconque";

    assert.equal(typeof token, "string");
  });
});

describe("identifiants du sprint de démonstration", () => {
  it("un RistourneId n'est pas accepté là où un TontineId est attendu", () => {
    const ristourneId = "0" as RistourneId;

    // @ts-expect-error une ristourne n'est pas assimilée à une tontine
    const tontineId: TontineId = ristourneId;

    assert.equal(typeof tontineId, "string");
  });

  it("un UserId n'est pas accepté là où un MemberId est attendu", () => {
    const userId = "0" as UserId;

    // @ts-expect-error un UserId n'est pas un MemberId (adhérent d'une tontine)
    const memberId: MemberId = userId;

    assert.equal(typeof memberId, "string");
  });

  it("un SavingsCardId n'est pas accepté là où un TontineId est attendu", () => {
    const cardId = "0" as SavingsCardId;

    // @ts-expect-error une carte de pointage n'est pas une tontine
    const tontineId: TontineId = cardId;

    assert.equal(typeof tontineId, "string");
  });

  it("un MovementId et un LoginChallengeId ne sont pas des TransactionId", () => {
    const movementId = "0" as MovementId;
    const challengeId = "0" as LoginChallengeId;

    // @ts-expect-error un mouvement affiché n'est pas une transaction de paiement
    const fromMovement: TransactionId = movementId;
    // @ts-expect-error une tentative de connexion n'est pas une transaction
    const fromChallenge: TransactionId = challengeId;

    assert.equal(typeof fromMovement, typeof fromChallenge);
  });
});
