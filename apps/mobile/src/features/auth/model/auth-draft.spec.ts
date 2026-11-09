import { INITIAL_AUTH_DRAFT, useAuthDraft } from "./auth-draft";

describe("useAuthDraft", () => {
  beforeEach(() => {
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
  });

  it("retient le numéro de la connexion", () => {
    useAuthDraft.getState().startSignIn("+242 06 570 6622");

    expect(useAuthDraft.getState()).toMatchObject({
      mode: "sign-in",
      name: "",
      phone: "+242 06 570 6622",
    });
  });

  it("retient l'identité de l'inscription", () => {
    useAuthDraft.getState().startSignUp("Aimée", "+242 06 570 6622");

    expect(useAuthDraft.getState()).toMatchObject({
      mode: "sign-up",
      name: "Aimée",
      phone: "+242 06 570 6622",
    });
  });

  it("efface le brouillon après le parcours", () => {
    useAuthDraft.getState().startSignUp("Aimée", "+242 06 570 6622");
    useAuthDraft.getState().reset();

    expect(useAuthDraft.getState()).toMatchObject(INITIAL_AUTH_DRAFT);
  });
});
