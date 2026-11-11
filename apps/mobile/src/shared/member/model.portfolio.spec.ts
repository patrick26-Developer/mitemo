import type { SavingsCard, Tontine, TontineMember } from "./model.portfolio";
import {
  beneficiaryName,
  canPayContribution,
  cardCapabilities,
  cardGoal,
  cardProgress,
  createId,
  formatFrequency,
  isTontineAdmin,
  isTontineBeneficiary,
  markerFill,
  markersDone,
  memberName,
  paidMemberCount,
  remainingMarkers,
  remainingToSave,
  SELF_MEMBER_ID,
  tontinePot,
  totalSaved,
} from "./model.portfolio";

/**
 * Construit un membre de tontine.
 * @param id Identifiant du membre.
 * @param role Rôle dans la tontine.
 * @param paid `true` quand la cotisation du tour est réglée.
 * @returns Le membre prêt à être utilisé.
 */
function member(id: string, role: "ADMIN" | "MEMBRE", paid = false): TontineMember {
  return { id, name: `Membre ${id}`, role, paidCurrentRound: paid };
}

/**
 * Construit une tontine de test.
 * @param over Valeurs à remplacer.
 * @returns La tontine complète.
 */
function tontine(over: Partial<Tontine> = {}): Tontine {
  return {
    id: "t1",
    name: "Tontine de test",
    contribution: 5_000n,
    frequency: { unit: "semaine", interval: 1 },
    round: 1,
    totalRounds: 10,
    state: "ACTIVE",
    members: [member(SELF_MEMBER_ID, "ADMIN"), member("m2", "MEMBRE"), member("m3", "MEMBRE")],
    beneficiaryId: "m2",
    description: "Une tontine de test.",
    headerColors: ["#2CCA86", "#62F79D"],
    invitationCode: null,
    ...over,
  };
}

/**
 * Construit une carte de test.
 * @param over Valeurs à remplacer.
 * @returns La carte complète.
 */
function card(over: Partial<SavingsCard> = {}): SavingsCard {
  return {
    id: "c1",
    name: "Carte de test",
    goal: 30_000n,
    markerAmount: 5_000n,
    markersTotal: 6,
    frequency: { unit: "semaine", interval: 1 },
    startDate: "2026-11-01",
    saved: 20_000n,
    deadline: "2026-12-31",
    tint: "#CFD8FF",
    state: "ACTIVE",
    description: "Une carte de test.",
    tontineId: null,
    fee: 3_000n,
    entries: [],
    ...over,
  };
}

describe("tontinePot", () => {
  it("calcule la cagnotte brute sans la part du bénéficiaire", () => {
    expect(tontinePot(tontine())).toBe(10_000n);
  });

  it("renvoie zéro pour une tontine sans autre membre", () => {
    expect(tontinePot(tontine({ members: [member(SELF_MEMBER_ID, "ADMIN")] }))).toBe(0n);
  });

  it("annonce la cagnotte prévue d'une tontine en préparation, avant l'arrivée des membres", () => {
    const pending = tontine({
      state: "PENDING",
      totalRounds: 6,
      members: [member(SELF_MEMBER_ID, "ADMIN")],
    });

    expect(tontinePot(pending)).toBe(25_000n);
  });
});

describe("rôles et bénéficiaire", () => {
  it("reconnaît le membre connecté administrateur", () => {
    expect(isTontineAdmin(tontine())).toBe(true);
  });

  it("reconnaît un membre connecté simple participant", () => {
    const other = tontine({ members: [member(SELF_MEMBER_ID, "MEMBRE")] });

    expect(isTontineAdmin(other)).toBe(false);
  });

  it("reconnaît le bénéficiaire du tour", () => {
    expect(isTontineBeneficiary(tontine({ beneficiaryId: SELF_MEMBER_ID }))).toBe(true);
  });

  it("retrouve le nom du bénéficiaire", () => {
    expect(beneficiaryName(tontine())).toBe("Membre m2");
  });

  it("retombe sur « Membre inconnu » quand le membre a quitté", () => {
    expect(memberName(tontine(), "absent")).toBe("Membre inconnu");
  });
});

describe("canPayContribution", () => {
  it("autorise le membre connecté qui n'a pas encore payé", () => {
    expect(canPayContribution(tontine())).toBe(true);
  });

  it("refuse une cotisation déjà réglée", () => {
    const paid = tontine({ members: [member(SELF_MEMBER_ID, "ADMIN", true)] });

    expect(canPayContribution(paid)).toBe(false);
  });

  it("refuse une tontine terminée", () => {
    expect(canPayContribution(tontine({ state: "COMPLETED" }))).toBe(false);
  });

  it("refuse un membre qui ne participe pas", () => {
    expect(canPayContribution(tontine({ members: [member("m2", "ADMIN")] }))).toBe(false);
  });
});

describe("paidMemberCount", () => {
  it("compte les cotisations réglées du tour", () => {
    const mixed = tontine({
      members: [member(SELF_MEMBER_ID, "ADMIN", true), member("m2", "MEMBRE")],
    });

    expect(paidMemberCount(mixed)).toBe(1);
  });
});

describe("progression d'une carte", () => {
  it("calcule les marqueurs validés, bornés au total", () => {
    expect(markersDone(card())).toBe(4);
    expect(markersDone(card({ saved: 100_000n }))).toBe(6);
  });

  it("renvoie zéro quand le marqueur est nul", () => {
    expect(markersDone(card({ markerAmount: 0n }))).toBe(0);
  });

  it("calcule l'objectif de la carte", () => {
    expect(cardGoal(card({ goal: 42_000n }))).toBe(42_000n);
  });

  it("remplit le marqueur en cours au prorata d'un versement plus élevé", () => {
    expect(markerFill(card({ saved: 22_500n }))).toBe(50);
    expect(markerFill(card({ saved: 20_000n }))).toBe(0);
    expect(markerFill(card({ saved: 30_000n }))).toBe(0);
  });

  it("calcule les marqueurs restants", () => {
    expect(remainingMarkers(card())).toBe(2);
  });

  it("calcule le reste à épargner", () => {
    expect(remainingToSave(card())).toBe(10_000n);
  });

  it("ne descend jamais sous zéro quand l'objectif est dépassé", () => {
    expect(remainingToSave(card({ saved: 40_000n }))).toBe(0n);
  });

  it("calcule la part validée entre 0 et 1", () => {
    expect(cardProgress(card())).toBeCloseTo(4 / 6, 2);
    expect(cardProgress(card({ goal: 0n }))).toBe(0);
  });
});

describe("cardCapabilities", () => {
  it("autorise versement et transfert sur une carte active rattachée, sans retrait avant l'objectif", () => {
    expect(cardCapabilities(card({ tontineId: "t1" }))).toEqual({
      canContribute: true,
      canWithdraw: false,
      canTransfer: true,
    });
  });

  it("n'autorise le retrait qu'une fois l'objectif atteint", () => {
    expect(cardCapabilities(card({ saved: 29_999n })).canWithdraw).toBe(false);
    expect(cardCapabilities(card({ saved: 30_000n, state: "COMPLETED" })).canWithdraw).toBe(true);
    expect(cardCapabilities(card({ saved: 30_000n, state: "ARCHIVED" })).canWithdraw).toBe(false);
  });

  it("interdit le transfert sans tontine rattachée", () => {
    expect(cardCapabilities(card()).canTransfer).toBe(false);
  });

  it("interdit le versement quand l'objectif est atteint", () => {
    expect(cardCapabilities(card({ saved: 30_000n })).canContribute).toBe(false);
  });
});

describe("totalSaved", () => {
  it("additionne l'épargne de toutes les cartes", () => {
    expect(totalSaved([card(), card({ id: "c2", saved: 1_000n })])).toBe(21_000n);
  });

  it("ne compte plus l'épargne déjà retirée d'une carte archivée", () => {
    expect(totalSaved([card(), card({ id: "c2", saved: 50_000n, state: "ARCHIVED" })])).toBe(
      20_000n,
    );
  });
});

describe("formatFrequency", () => {
  it("met au singulier un cycle d'une unité", () => {
    expect(formatFrequency({ unit: "semaine", interval: 1 })).toBe("chaque semaine");
  });

  it("met au pluriel un cycle de plusieurs unités", () => {
    expect(formatFrequency({ unit: "semaine", interval: 2 })).toBe("toutes les 2 semaines");
  });

  it("accorde au masculin les jours et garde « mois » invariable", () => {
    expect(formatFrequency({ unit: "jour", interval: 2 })).toBe("tous les 2 jours");
    expect(formatFrequency({ unit: "mois", interval: 3 })).toBe("tous les 3 mois");
  });
});

describe("createId", () => {
  it("préfixe l'identifiant tiré par le générateur", () => {
    expect(createId("tontine", () => "uuid-1")).toBe("tontine-uuid-1");
  });

  it("tire par défaut un UUID différent à chaque appel", () => {
    const first = createId("card");

    expect(first).toMatch(/^card-[0-9a-f-]{36}$/);
    expect(createId("card")).not.toBe(first);
  });
});
