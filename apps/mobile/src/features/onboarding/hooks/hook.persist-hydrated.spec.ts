import { act, renderHook } from "@testing-library/react-native";

import { usePersistHydrated } from "./hook.persist-hydrated";

/**
 * Double de l'API `persist` dont on déclenche la fin de relecture à la main.
 * @returns L'API et le déclencheur.
 */
function makePersist() {
  let listener: (() => void) | null = null;
  let hydrated = false;
  return {
    api: {
      hasHydrated: () => hydrated,
      onFinishHydration: (next: () => void) => {
        listener = next;
        return () => undefined;
      },
    },
    finish: () => {
      hydrated = true;
      listener?.();
    },
  };
}

describe("usePersistHydrated", () => {
  it("passe à vrai à la fin de la relecture", async () => {
    const persist = makePersist();
    const { result } = await renderHook(() => usePersistHydrated(persist.api));

    expect(result.current).toBe(false);
    await act(async () => {
      persist.finish();
    });

    expect(result.current).toBe(true);
  });
});
