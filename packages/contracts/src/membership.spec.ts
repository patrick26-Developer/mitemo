import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  CreateInvitationResponse,
  JoinTontineRequest,
  MembershipState,
} from "./membership.ts";
import { MEMBERSHIP_STATES } from "./membership.ts";
import { toIsoDateTime } from "./datetime.ts";
import type { InvitationToken, MemberId, TontineId } from "./identifiers.ts";

describe("MembershipState", () => {
  it("contient les dix états de l'automate (docs/audit/03-architecture-technique.md, §2)", () => {
    assert.deepEqual(MEMBERSHIP_STATES, [
      "INVITE",
      "ACCEPTE",
      "GARANTIE_BLOQUEE",
      "ACTIF",
      "EN_ATTENTE",
      "GELE_24H",
      "INCIDENT",
      "EXCLU",
      "SORTANT",
      "SUCCESSION",
    ]);
  });

  it("refuse un état inconnu", () => {
    // @ts-expect-error "EN_PAUSE" n'est pas un état de l'automate adhésion
    const state: MembershipState = "EN_PAUSE";

    assert.equal(typeof state, "string");
  });
});

describe("CreateInvitationResponse", () => {
  it("renvoie un jeton d'invitation daté et borné dans le temps", () => {
    const response: CreateInvitationResponse = {
      token: "jeton" as InvitationToken,
      tontineId: "0" as TontineId,
      createdAt: toIsoDateTime("2026-11-06T12:00:00.000Z"),
      expiresAt: toIsoDateTime("2026-11-08T12:00:00.000Z"),
    };

    assert.equal(typeof response.token, "string");
  });
});

describe("JoinTontineRequest", () => {
  it("identifie le membre par son jeton d'invitation, pas par une recherche libre", () => {
    const request: JoinTontineRequest = {
      token: "jeton" as InvitationToken,
      memberId: "0" as MemberId,
    };

    assert.equal(typeof request.token, "string");
  });
});
