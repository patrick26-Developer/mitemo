import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useAsyncAction } from "./hook.async-action";

describe("action serveur sérialisée", () => {
  it("ignore un double appui avant le prochain rendu", async () => {
    const operation = jest.fn().mockResolvedValue(undefined);
    const { result } = await renderHook(() => useAsyncAction(() => "Échec"));
    await act(async () => {
      result.current.run(operation);
      result.current.run(operation);
    });
    expect(operation).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.pending).toBe(false));
  });
  it("traduit un refus en erreur visible sans succès local", async () => {
    const { result } = await renderHook(() => useAsyncAction(() => "Échec serveur"));
    await act(async () =>
      result.current.run(async () => {
        throw new Error("offline");
      }),
    );
    await waitFor(() => expect(result.current.error).toBe("Échec serveur"));
  });
});
