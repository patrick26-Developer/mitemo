import { useToastStore } from "./store.toast";

describe("useToastStore", () => {
  beforeEach(() => {
    useToastStore.getState().dismiss();
  });

  it("commence sans toast", () => {
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("affiche le dernier message, avec un identifiant nouveau à chaque fois", () => {
    useToastStore.getState().show("success", "Pointage réglé.");
    const first = useToastStore.getState().toast;
    useToastStore.getState().show("error", "Votre solde est insuffisant.");
    const second = useToastStore.getState().toast;

    expect(second).toMatchObject({ kind: "error", message: "Votre solde est insuffisant." });
    expect(second?.id).not.toBe(first?.id);
  });

  it("retire le toast", () => {
    useToastStore.getState().show("success", "C'est fait.");
    useToastStore.getState().dismiss();

    expect(useToastStore.getState().toast).toBeNull();
  });
});
