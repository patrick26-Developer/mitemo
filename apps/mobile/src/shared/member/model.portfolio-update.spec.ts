import { SELF_MEMBER_ID } from "./model.portfolio";
import {
  ForbiddenOperationError,
  InsufficientFundsError,
  InvalidAmountError,
  UnknownEntityError,
} from "./model.portfolio-error";
import {
  addSaved,
  advanceRound,
  clearSaved,
  deductSaved,
  findSelfMember,
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
import { firstOf, makeCard, makeMember, makeTontine } from "../testing/fixtures.portfolio";

describe("retrouver une entité", () => {
  it("renvoie la tontine demandée", () => {
    expect(requireTontine([makeTontine()], "t1").id).toBe("t1");
  });

  it("lève une erreur typée pour une tontine inconnue", () => {
    expect(() => requireTontine([], "t1")).toThrow(UnknownEntityError);
  });

  it("renvoie la carte demandée", () => {
    expect(requireCard([makeCard()], "c1").id).toBe("c1");
  });

  it("lève une erreur typée pour une carte inconnue", () => {
    expect(() => requireCard([], "c1")).toThrow(UnknownEntityError);
  });
});

describe("garde-fous", () => {
  it("refuse un montant nul ou négatif", () => {
    expect(() => requirePositive(0n)).toThrow(InvalidAmountError);
    expect(() => requirePositive(-1n)).toThrow(InvalidAmountError);
    expect(() => requirePositive(1n)).not.toThrow();
  });

  it("refuse une opération au-delà du solde", () => {
    expect(() => requireFunds(1_000n, 2_000n)).toThrow(InsufficientFundsError);
    expect(() => requireFunds(2_000n, 2_000n)).not.toThrow();
  });

  it("refuse la cotisation d'une tontine terminée", () => {
    expect(() => requireSelfCanPay(makeTontine({ state: "COMPLETED" }))).toThrow(
      ForbiddenOperationError,
    );
  });

  it("refuse la cotisation d'un non-participant", () => {
    expect(() => requireSelfCanPay(makeTontine({ members: [makeMember("m2", "ADMIN")] }))).toThrow(
      ForbiddenOperationError,
    );
  });

  it("refuse une cotisation déjà réglée", () => {
    const paid = makeTontine({ members: [makeMember(SELF_MEMBER_ID, "ADMIN", true)] });

    expect(() => requireSelfCanPay(paid)).toThrow(ForbiddenOperationError);
  });

  it("accepte la cotisation du membre connecté", () => {
    expect(() => requireSelfCanPay(makeTontine())).not.toThrow();
  });

  it("réserve l'administration au rôle ADMIN", () => {
    expect(() => requireAdmin(makeTontine())).not.toThrow();
    expect(() =>
      requireAdmin(makeTontine({ members: [makeMember(SELF_MEMBER_ID, "MEMBRE")] })),
    ).toThrow(ForbiddenOperationError);
  });

  it("refuse un transfert vers soi-même", () => {
    expect(() => requireOtherMember(makeTontine(), SELF_MEMBER_ID)).toThrow(
      ForbiddenOperationError,
    );
  });

  it("refuse un transfert vers un inconnu", () => {
    expect(() => requireOtherMember(makeTontine(), "absent")).toThrow(UnknownEntityError);
  });

  it("accepte un transfert vers un autre membre", () => {
    expect(() => requireOtherMember(makeTontine(), "m2")).not.toThrow();
  });
});

describe("findSelfMember", () => {
  it("retrouve le membre connecté", () => {
    expect(findSelfMember(makeTontine())?.id).toBe(SELF_MEMBER_ID);
  });

  it("renvoie undefined quand il ne participe pas", () => {
    expect(findSelfMember(makeTontine({ members: [makeMember("m2", "ADMIN")] }))).toBeUndefined();
  });
});

describe("markSelfPaid", () => {
  it("marque la cotisation du membre connecté sans toucher les autres", () => {
    const updated = firstOf(markSelfPaid([makeTontine()], "t1"));

    expect(findSelfMember(updated)?.paidCurrentRound).toBe(true);
    expect(updated.members.find((entry) => entry.id === "m2")?.paidCurrentRound).toBe(false);
  });

  it("laisse les autres tontines intactes", () => {
    const other = makeTontine({ id: "t2" });
    const updated = markSelfPaid([makeTontine(), other], "t1");

    expect(updated[1]).toBe(other);
  });
});

describe("advanceRound", () => {
  it("passe au tour suivant, remet les cotisations à zéro et change de bénéficiaire", () => {
    const current = makeTontine({
      members: [
        makeMember(SELF_MEMBER_ID, "ADMIN", true),
        makeMember("m2", "MEMBRE"),
        makeMember("m3", "MEMBRE"),
      ],
      beneficiaryId: "m2",
    });
    const [updated] = advanceRound([current], "t1");

    expect(updated?.round).toBe(2);
    expect(updated?.beneficiaryId).toBe("m3");
    expect(updated?.members[0]?.paidCurrentRound).toBe(false);
  });

  it("clôt la tontine au dernier tour", () => {
    const [updated] = advanceRound([makeTontine({ round: 3, totalRounds: 3 })], "t1");

    expect(updated?.state).toBe("COMPLETED");
    expect(updated?.round).toBe(3);
  });
});

describe("removeTontineMember", () => {
  it("retire le membre de la tontine", () => {
    const [updated] = removeTontineMember([makeTontine()], "t1", "m3");

    expect(updated?.members.map((entry) => entry.id)).toEqual([SELF_MEMBER_ID, "m2"]);
  });

  it("repasse la cagnotte au premier membre quand le bénéficiaire part", () => {
    const [updated] = removeTontineMember([makeTontine()], "t1", "m2");

    expect(updated?.beneficiaryId).toBe(SELF_MEMBER_ID);
  });

  it("garde le bénéficiaire quand un autre membre part", () => {
    const [updated] = removeTontineMember([makeTontine()], "t1", "m3");

    expect(updated?.beneficiaryId).toBe("m2");
  });
});

describe("setInvitationCode", () => {
  it("enregistre le code sur la bonne tontine", () => {
    const updated = setInvitationCode([makeTontine()], "t1", "ABC123");

    expect(updated[0]?.invitationCode).toBe("ABC123");
  });
});

describe("listes", () => {
  it("ajoute une tontine en tête", () => {
    const added = makeTontine({ id: "t2" });

    expect(prependTontine([makeTontine()], added).map((entry) => entry.id)).toEqual(["t2", "t1"]);
  });

  it("ajoute une carte en tête", () => {
    const added = makeCard({ id: "c2" });

    expect(prependCard([makeCard()], added).map((entry) => entry.id)).toEqual(["c2", "c1"]);
  });
});

describe("épargne d'une carte", () => {
  it("ajoute un montant à l'épargne", () => {
    const [updated] = addSaved([makeCard()], "c1", 5_000n);

    expect(updated?.saved).toBe(25_000n);
    expect(updated?.state).toBe("ACTIVE");
  });

  it("clôt la carte quand l'objectif est atteint", () => {
    const [updated] = addSaved([makeCard()], "c1", 10_000n);

    expect(updated?.state).toBe("COMPLETED");
  });

  it("retire un montant de l'épargne", () => {
    expect(deductSaved([makeCard()], "c1", 5_000n)[0]?.saved).toBe(15_000n);
  });

  it("vide l'épargne et clôt la carte", () => {
    const [updated] = clearSaved([makeCard()], "c1");

    expect(updated?.saved).toBe(0n);
    expect(updated?.state).toBe("COMPLETED");
  });
});
