import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { invitationMessage, tontineCreatedSummary } from "./model.tontine-created";

/** Tontine tout juste créée : l'administrateur seul, six participants prévus. */
const FRESH = makeTontine({
  name: "Les Amis",
  state: "PENDING",
  contribution: 5_000n,
  totalRounds: 6,
  frequency: { unit: "semaine", interval: 1 },
  members: [{ id: "self", name: "Moi", role: "ADMIN", paidCurrentRound: false }],
});

describe("tontineCreatedSummary", () => {
  it("annonce les participants prévus, ceux qui restent à inviter et la cagnotte promise", () => {
    expect(tontineCreatedSummary(FRESH)).toBe(
      "« Les Amis » est prévue pour 6 participants, chaque semaine. Invitez les 5 autres membres. Cagnotte de 25 000 FCFA par tour.",
    );
  });

  it("accorde la phrase quand il ne reste qu'un membre à inviter", () => {
    const duo = { ...FRESH, totalRounds: 2 };

    expect(tontineCreatedSummary(duo)).toContain("Invitez l'autre membre.");
  });
});

describe("invitationMessage", () => {
  it("invite à rejoindre la tontine avec son code", () => {
    expect(invitationMessage(FRESH, "K7P2QX")).toBe(
      "Rejoignez ma tontine « Les Amis » sur Mitemo : 5 000 FCFA chaque semaine. Code d'invitation : K7P2QX",
    );
  });
});
