import { SELF_MEMBER_ID } from "./model.portfolio";
import type { CreateCardInput, CreateTontineInput } from "./model.portfolio-create";
import { buildCard, buildTontine } from "./model.portfolio-create";

/** Entrée de création de tontine utilisée par les tests. */
const TONTINE_INPUT: CreateTontineInput = {
  name: "Tontine des tests",
  contribution: 5_000n,
  frequency: { unit: "semaine", interval: 1 },
  participantCount: 4,
  description: "Une tontine créée en test.",
};

/** Entrée de création de carte utilisée par les tests. */
const CARD_INPUT: CreateCardInput = {
  name: "Carte des tests",
  markerAmount: 2_000n,
  markersTotal: 5,
  deadline: "2027-01-31",
  tontineId: null,
  description: "Une carte créée en test.",
};

describe("buildTontine", () => {
  it("part au premier tour, active, sans code d'invitation", () => {
    const created = buildTontine(TONTINE_INPUT, 0);

    expect(created.round).toBe(1);
    expect(created.state).toBe("ACTIVE");
    expect(created.invitationCode).toBeNull();
    expect(created.totalRounds).toBe(4);
  });

  it("inscrit le membre connecté en administrateur puis les invités", () => {
    const created = buildTontine(TONTINE_INPUT, 0);

    expect(created.members).toHaveLength(4);
    expect(created.members[0]).toMatchObject({ id: SELF_MEMBER_ID, role: "ADMIN" });
    expect(created.members.slice(1).every((member) => member.role === "MEMBRE")).toBe(true);
    expect(created.beneficiaryId).toBe(SELF_MEMBER_ID);
  });

  it("nomme les invités au-delà du vivier", () => {
    const created = buildTontine({ ...TONTINE_INPUT, participantCount: 12 }, 0);

    expect(created.members[10]?.name).toBe("Membre 11");
  });

  it("n'inscrit que le membre connecté pour un seul participant", () => {
    const created = buildTontine({ ...TONTINE_INPUT, participantCount: 1 }, 0);

    expect(created.members).toHaveLength(1);
  });

  it("fait tourner les dégradés selon le rang", () => {
    expect(buildTontine(TONTINE_INPUT, 0).headerColors).toEqual(["#2CCA86", "#62F79D"]);
    expect(buildTontine(TONTINE_INPUT, 4).headerColors).toEqual(["#2CCA86", "#62F79D"]);
    expect(buildTontine(TONTINE_INPUT, 1).headerColors).not.toEqual(
      buildTontine(TONTINE_INPUT, 0).headerColors,
    );
  });

  it("préfixe l'identifiant par le type d'entité", () => {
    expect(buildTontine(TONTINE_INPUT, 0).id.startsWith("tontine-")).toBe(true);
  });
});

describe("buildCard", () => {
  it("part avec une épargne nulle et une carte active", () => {
    const created = buildCard(CARD_INPUT, 0);

    expect(created.saved).toBe(0n);
    expect(created.state).toBe("ACTIVE");
  });

  it("conserve le rattachement à une tontine", () => {
    expect(buildCard({ ...CARD_INPUT, tontineId: "t1" }, 0).tontineId).toBe("t1");
    expect(buildCard(CARD_INPUT, 0).tontineId).toBeNull();
  });

  it("fait tourner les teintes selon le rang", () => {
    expect(buildCard(CARD_INPUT, 0).tint).not.toBe(buildCard(CARD_INPUT, 1).tint);
  });

  it("préfixe l'identifiant par le type d'entité", () => {
    expect(buildCard(CARD_INPUT, 0).id.startsWith("card-")).toBe(true);
  });
});
