import { act, renderHook } from "@testing-library/react-native";
import type { LayoutChangeEvent } from "react-native";

import { DOCK_GAP, MIN_DOCK_INSET, useDockInset } from "./hook.dock-inset";

/**
 * Construit un événement de mise en page de la hauteur donnée.
 * @param height Hauteur mesurée du dock, en points.
 * @returns L'événement simulé.
 */
function layoutOf(height: number): LayoutChangeEvent {
  return { nativeEvent: { layout: { x: 0, y: 0, width: 390, height } } } as LayoutChangeEvent;
}

describe("useDockInset", () => {
  it("réserve une marge minimale tant que le dock n'est pas mesuré", async () => {
    const { result } = await renderHook(() => useDockInset());

    expect(result.current.paddingBottom).toBe(MIN_DOCK_INSET);
  });

  it("réserve la hauteur mesurée du dock quand elle dépasse le minimum", async () => {
    const { result } = await renderHook(() => useDockInset());

    await act(() => result.current.onDockLayout(layoutOf(170)));

    expect(result.current.paddingBottom).toBe(170 + DOCK_GAP);
  });

  it("garde le minimum pour un dock plus petit", async () => {
    const { result } = await renderHook(() => useDockInset());

    await act(() => result.current.onDockLayout(layoutOf(40)));

    expect(result.current.paddingBottom).toBe(MIN_DOCK_INSET);
  });
});
