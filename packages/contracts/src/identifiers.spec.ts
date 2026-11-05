import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  ContributionId,
  GroupId,
  InvitationToken,
  MemberId,
  RoundId,
  TontineId,
  TransactionId,
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
