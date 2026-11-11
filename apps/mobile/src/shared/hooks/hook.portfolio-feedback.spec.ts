import { act, renderHook } from "@testing-library/react-native";

import { usePortfolioFeedback } from "./hook.portfolio-feedback";

describe("usePortfolioFeedback", () => {
  it("commence sans message", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());

    expect(result.current.feedback).toBeNull();
  });

  it("annonce le succès et indique que l'opération a réussi", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());
    const action = jest.fn();
    let succeeded = false;

    await act(() => {
      succeeded = result.current.run(action, "C'est fait.");
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(succeeded).toBe(true);
    expect(result.current.feedback).toEqual({ kind: "success", message: "C'est fait." });
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
    expect(result.current.feedback).toEqual({ kind: "error", message: "Solde insuffisant." });
  });

  it("retombe sur un message générique pour une erreur sans texte", async () => {
    const { result } = await renderHook(() => usePortfolioFeedback());

    await act(() => {
      result.current.run(() => {
        throw new Error("");
      }, "C'est fait.");
    });

    expect(result.current.feedback).toEqual({
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

    expect(result.current.feedback).toEqual({ kind: "success", message: "Second versement." });
  });
});
