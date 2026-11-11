import { act, renderHook } from "@testing-library/react-native";

import { useToastStore } from "../feedback/store.toast";
import { usePortfolioFeedback } from "./hook.portfolio-feedback";

/**
 * Lit le toast affiché, sans son identifiant.
 * @returns La nature et le message du toast, ou `null`.
 */
function shownToast() {
  const toast = useToastStore.getState().toast;
  return toast === null ? null : { kind: toast.kind, message: toast.message };
}

describe("usePortfolioFeedback", () => {
  beforeEach(() => {
    useToastStore.getState().dismiss();
  });

  it("n'affiche rien avant la première opération", async () => {
    await renderHook(() => usePortfolioFeedback());

    expect(shownToast()).toBeNull();
  });

  it("annonce le succès dans un toast et indique que l'opération a réussi", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());
    const action = jest.fn();
    let succeeded = false;

    await act(() => {
      succeeded = result.current.run(action, "C'est fait.");
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(succeeded).toBe(true);
    expect(shownToast()).toEqual({ kind: "success", message: "C'est fait." });
  });

  it("affiche le message métier d'une opération refusée", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());
    let succeeded = true;

    await act(() => {
      succeeded = result.current.run(() => {
        throw new Error("Solde insuffisant.");
      }, "C'est fait.");
    });

    expect(succeeded).toBe(false);
    expect(shownToast()).toEqual({ kind: "error", message: "Solde insuffisant." });
  });

  it("retombe sur un message générique pour une erreur sans texte", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());

    await act(() => {
      result.current.run(() => {
        throw new Error("");
      }, "C'est fait.");
    });

    expect(shownToast()).toEqual({
      kind: "error",
      message: "L'opération n'a pas pu aboutir. Réessayez.",
    });
  });

  it("remplace le message précédent par le plus récent", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());

    await act(() => {
      result.current.run(() => undefined, "Premier versement.");
    });
    await act(() => {
      result.current.run(() => undefined, "Second versement.");
    });

    expect(shownToast()).toEqual({ kind: "success", message: "Second versement." });
  });

  it("reste silencieux quand l'opération réussie n'a pas de message", async () => {
    useToastStore.getState().dismiss();
    const { result } = await renderHook(() => usePortfolioFeedback());

    await act(() => {
      result.current.run(() => undefined, null);
    });

    expect(shownToast()).toBeNull();
  });
});
