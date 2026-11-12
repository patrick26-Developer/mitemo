import { act, renderHook } from "@testing-library/react-native";

import { useSplashVisible } from "./hook.splash-visible";

describe("useSplashVisible", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("garde l'écran de lancement pendant la durée minimale", async () => {
    const { result } = await renderHook(() => useSplashVisible({ ready: true, minDuration: 1200 }));

    expect(result.current).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });

    expect(result.current).toBe(false);
  });

  it("attend que les données de l'appareil soient relues", async () => {
    const { result, rerender } = await renderHook(
      (props: { ready: boolean }) => useSplashVisible({ ready: props.ready, minDuration: 100 }),
      { initialProps: { ready: false } },
    );
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);

    await rerender({ ready: true });

    expect(result.current).toBe(false);
  });
});
