import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { invitationFacts, turnsChoiceHint } from "./model.invitation-reply";

/** Tontine proposée : 2 500 FCFA chaque semaine, 12 tours dont 7 pris. */
const OFFERED = makeTontine({
  state: "PENDING",
  contribution: 2_500n,
  totalRounds: 12,
  members: [
    { ...makeMember("p1", "ADMIN"), turns: 2 },
    { ...makeMember("p2", "MEMBRE"), turns: 5 },
  ],
});

describe("invitationFacts", () => {
  it("résume la cotisation, le rythme et les tours encore libres", () => {
    expect(invitationFacts(OFFERED)).toEqual([
      { label: "Cotisation par tour", value: "2 500 FCFA" },
      { label: "Fréquence", value: "chaque semaine" },
      { label: "Tours libres", value: "5 sur 12" },
    ]);
  });
});

describe("turnsChoiceHint", () => {
  it("annonce le versement et le nombre de restournes pour un tour", () => {
    expect(turnsChoiceHint(OFFERED, 1)).toBe(
      "Vous cotiserez 2 500 FCFA à chaque tour et toucherez la restourne 1 fois.",
    );
  });

  it("multiplie le versement par le nombre de tours", () => {
    expect(turnsChoiceHint(OFFERED, 3)).toBe(
      "Vous cotiserez 7 500 FCFA à chaque tour et toucherez la restourne 3 fois.",
    );
  });
});
