import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useRemoteResource } from "./hook.remote-resource";
import type { RemoteResource } from "./hook.remote-resource";

interface ResourceProps {
  readonly load: () => Promise<string>;
}

describe("lecture serveur sans données fictives", () => {
  it("ignore une ancienne réponse arrivée après le changement de ressource", async () => {
    let finish: ((value: string) => void) | undefined;
    const first = () =>
      new Promise<string>((resolve) => {
        finish = resolve;
      });
    const { result, rerender } = await renderHook<RemoteResource<string>, ResourceProps>(
      ({ load }) => useRemoteResource(load),
      {
        initialProps: { load: first },
      },
    );
    await rerender({ load: () => Promise.resolve("deuxième compte") });
    await waitFor(() => expect(result.current.data).toBe("deuxième compte"));
    await act(async () => finish?.("ancien compte"));
    expect(result.current.data).toBe("deuxième compte");
  });
  it("permet de reprendre après une erreur sans garder une valeur locale", async () => {
    const load = jest
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce("serveur");
    const { result } = await renderHook(() => useRemoteResource(load));
    await waitFor(() => expect(result.current.error).not.toBe(""));
    expect(result.current.data).toBeNull();
    await act(async () => result.current.reload());
    await waitFor(() => expect(result.current.data).toBe("serveur"));
  });
});
