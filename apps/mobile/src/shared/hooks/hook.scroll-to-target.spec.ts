import { act, renderHook } from "@testing-library/react-native";
import type { LayoutChangeEvent, ScrollViewInstance } from "react-native";

import { useScrollToTarget } from "./hook.scroll-to-target";

/**
 * Événement de mise en page d'une section placée à la hauteur donnée.
 * @param y Position de la section, en points.
 * @returns L'événement simulé.
 */
function layoutAt(y: number): LayoutChangeEvent {
  return { nativeEvent: { layout: { x: 0, y, width: 390, height: 200 } } } as LayoutChangeEvent;
}

describe("useScrollToTarget", () => {
  it("défile une seule fois jusqu'à la section", async () => {
    const scrollTo = jest.fn();
    const { result } = await renderHook(() => useScrollToTarget(true));
    result.current.scrollRef.current = { scrollTo } as unknown as ScrollViewInstance;

    await act(async () => result.current.onTargetLayout(layoutAt(400)));
    await act(async () => result.current.onTargetLayout(layoutAt(420)));

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ y: 388, animated: true });
  });

  it("ne défile pas sans demande", async () => {
    const scrollTo = jest.fn();
    const { result } = await renderHook(() => useScrollToTarget(false));
    result.current.scrollRef.current = { scrollTo } as unknown as ScrollViewInstance;

    await act(async () => result.current.onTargetLayout(layoutAt(400)));

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
