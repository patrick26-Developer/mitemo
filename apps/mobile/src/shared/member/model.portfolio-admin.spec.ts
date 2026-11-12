import { SELF_MEMBER_ID } from "./model.portfolio";
import { ForbiddenOperationError } from "./model.portfolio-error";
import {
  firstOf,
  makeMember,
  makePortfolio,
  makeTontine,
  TEST_PORTFOLIO,
} from "../testing/fixtures.portfolio";
import { tontineSettingsOf } from "./model.tontine-settings";

describe("inviteMember", () => {
  /** Tontine à lancer, où il manque encore deux membres. */
  const OPEN = makeTontine({ state: "PENDING", members: [makeMember(SELF_MEMBER_ID, "ADMIN")] });

  it("crée puis conserve le même code d'invitation", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [OPEN] });

    const first = actions.inviteMember("t1");
    const second = actions.inviteMember("t1");

    expect(first).toHaveLength(6);
    expect(second).toBe(first);
    expect(state().tontines[0]?.invitationCode).toBe(first);
  });

  it("refuse l'invitation à un membre simple", () => {
    const simple = makeTontine({ members: [makeMember(SELF_MEMBER_ID, "MEMBRE")] });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [simple] });

    expect(() => actions.inviteMember("t1")).toThrow(ForbiddenOperationError);
  });

  it("refuse de partager une tontine lancée ou complète", () => {
    const full = makeTontine({ id: "t2", state: "PENDING" });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [makeTontine(), full] });

    expect(() => actions.inviteMember("t1")).toThrow(
      "Cette tontine n'accepte plus de nouveaux membres.",
    );
    expect(() => actions.inviteMember("t2")).toThrow(
      "Cette tontine n'accepte plus de nouveaux membres.",
    );
  });
});

describe("updateTontineSettings", () => {
  it("enregistre le nouveau nom et la nouvelle couleur de la tontine", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);
    const current = firstOf(state().tontines);

    actions.updateTontineSettings("t1", {
      ...tontineSettingsOf(current),
      name: "Tontine des Amis",
      headerColors: ["#F5B94A", "#FAD98C"],
    });

    expect(state().tontines[0]).toMatchObject({
      name: "Tontine des Amis",
      headerColors: ["#F5B94A", "#FAD98C"],
    });
  });
});

describe("removeMember", () => {
  it("retire un autre membre de la tontine", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.removeMember("t1", "m2");

    expect(state().tontines[0]?.members.map((entry) => entry.id)).toEqual([SELF_MEMBER_ID, "m3"]);
  });

  it("refuse de retirer le membre connecté", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.removeMember("t1", SELF_MEMBER_ID)).toThrow(ForbiddenOperationError);
  });
});
