import type { ReceivedInvitation } from "./model.invitation";
import { SELF_MEMBER_ID } from "./model.portfolio";
import { ForbiddenOperationError, UnknownEntityError } from "./model.portfolio-error";
import {
  makeMember,
  makePortfolio,
  makeTontine,
  TEST_PORTFOLIO,
} from "../testing/fixtures.portfolio";

/** Contact du répertoire qui a un compte Mitemo. */
const AIMEE = { name: "Aimée Mbemba", phone: "+242065706622" } as const;

/** Tontine en préparation de 4 tours, administrée par le membre connecté. */
const PENDING = makeTontine({
  state: "PENDING",
  totalRounds: 4,
  members: [makeMember(SELF_MEMBER_ID, "ADMIN")],
});

/** Invitation reçue : une tontine de 5 tours dont 3 sont déjà pris. */
const RECEIVED: ReceivedInvitation = {
  id: "inv-1",
  invitedBy: "Mama Nadège",
  tontine: makeTontine({
    id: "t9",
    state: "PENDING",
    totalRounds: 5,
    members: [makeMember("a1", "ADMIN"), { ...makeMember("a2", "MEMBRE"), turns: 2 }],
  }),
};

/**
 * Portefeuille de test qui a reçu une invitation.
 * @returns Les actions et l'accès à l'état.
 */
function invitedPortfolio() {
  return makePortfolio({ ...TEST_PORTFOLIO, invitations: [RECEIVED] });
}

describe("inviteContact", () => {
  it("envoie une invitation sans inscrire le contact", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [PENDING] });

    actions.inviteContact("t1", AIMEE);

    expect(state().tontines[0]?.members).toHaveLength(1);
    expect(state().tontines[0]?.invitations[0]).toMatchObject(AIMEE);
  });

  it("refuse d'inviter deux fois le même contact", () => {
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [PENDING] });
    actions.inviteContact("t1", AIMEE);

    expect(() => actions.inviteContact("t1", AIMEE)).toThrow(ForbiddenOperationError);
  });

  it("refuse une invitation quand tous les tours sont pris", () => {
    const { actions } = makePortfolio({
      ...TEST_PORTFOLIO,
      tontines: [makeTontine({ state: "PENDING" })],
    });

    expect(() => actions.inviteContact("t1", AIMEE)).toThrow(ForbiddenOperationError);
  });

  it("refuse l'invitation à un simple membre", () => {
    const tontine = { ...PENDING, members: [makeMember(SELF_MEMBER_ID, "MEMBRE")] };
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [tontine] });

    expect(() => actions.inviteContact("t1", AIMEE)).toThrow(ForbiddenOperationError);
  });
});

describe("cancelInvitation", () => {
  it("retire l'invitation envoyée", () => {
    const tontine = { ...PENDING, invitations: [{ id: "i1", ...AIMEE }] };
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [tontine] });

    actions.cancelInvitation("t1", "i1");

    expect(state().tontines[0]?.invitations).toEqual([]);
  });
});

describe("acceptInvitation", () => {
  it("inscrit le membre connecté avec ses tours et ajoute la tontine en tête", () => {
    const { actions, state } = invitedPortfolio();

    actions.acceptInvitation("inv-1", 2);

    const joined = state().tontines[0];
    expect(joined?.id).toBe("t9");
    expect(joined?.members.at(-1)).toMatchObject({ id: SELF_MEMBER_ID, turns: 2 });
    expect(state().invitations).toEqual([]);
  });

  it("refuse plus de tours qu'il n'en reste", () => {
    const { actions, state } = invitedPortfolio();

    expect(() => actions.acceptInvitation("inv-1", 3)).toThrow(ForbiddenOperationError);
    expect(state().invitations).toHaveLength(1);
  });

  it("refuse moins d'un tour", () => {
    const { actions } = invitedPortfolio();

    expect(() => actions.acceptInvitation("inv-1", 0)).toThrow(ForbiddenOperationError);
  });

  it("signale une invitation inconnue", () => {
    const { actions } = invitedPortfolio();

    expect(() => actions.acceptInvitation("absente", 1)).toThrow(UnknownEntityError);
  });
});

describe("declineInvitation", () => {
  it("retire l'invitation sans rejoindre la tontine", () => {
    const { actions, state } = invitedPortfolio();

    actions.declineInvitation("inv-1");

    expect(state().invitations).toEqual([]);
    expect(state().tontines.map((item) => item.id)).toEqual(["t1"]);
  });
});
