import { act, renderHook } from "@testing-library/react-native";
import type { RefObject } from "react";
import { TextInput } from "react-native";
import type { ScrollViewInstance } from "react-native";

import { REVEAL_DELAY_MS, REVEAL_MARGIN, useFocusedFieldReveal } from "./hook.focused-field-reveal";

/** Champ simulé qui a le focus. */
const FIELD = { id: "phone" };

/**
 * Crée une zone de défilement simulée qui enregistre ses défilements.
 * @returns La référence et l'espion du défilement vers le champ.
 */
function fakeScroll() {
  const scrollToField = jest.fn();
  const ref = {
    current: { scrollResponderScrollNativeHandleToKeyboard: scrollToField },
  } as unknown as RefObject<ScrollViewInstance | null>;

  return { ref, scrollToField };
}

/**
 * Simule le champ qui a le focus, ou aucun.
 * @param field Champ actif, ou `null`.
 */
function focus(field: unknown): void {
  jest
    .spyOn(TextInput.State, "currentlyFocusedInput")
    .mockReturnValue(field as ReturnType<typeof TextInput.State.currentlyFocusedInput>);
}

describe("useFocusedFieldReveal", () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("attend la fin du mouvement du clavier, puis ne défile que si le champ est caché", async () => {
    const { ref, scrollToField } = fakeScroll();
    focus(FIELD);

    const { rerender } = await renderHook(
      ({ keyboard }: { keyboard: number }) => useFocusedFieldReveal(ref, keyboard),
      { initialProps: { keyboard: 0 } },
    );
    await rerender({ keyboard: 320 });
    expect(scrollToField).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(REVEAL_DELAY_MS));

    expect(scrollToField).toHaveBeenCalledWith(FIELD, REVEAL_MARGIN, true);
  });

  it("ne fait rien tant que le clavier est fermé", async () => {
    const { ref, scrollToField } = fakeScroll();
    focus(FIELD);

    await renderHook(() => useFocusedFieldReveal(ref, 0));
    await act(() => jest.advanceTimersByTime(REVEAL_DELAY_MS));

    expect(scrollToField).not.toHaveBeenCalled();
  });

  it("ne fait rien quand aucun champ n'a le focus", async () => {
    const { ref, scrollToField } = fakeScroll();
    focus(null);

    await renderHook(() => useFocusedFieldReveal(ref, 320));
    await act(() => jest.advanceTimersByTime(REVEAL_DELAY_MS));

    expect(scrollToField).not.toHaveBeenCalled();
  });
});
