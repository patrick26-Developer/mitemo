import { act, renderHook } from "@testing-library/react-native";
import { Keyboard, Platform } from "react-native";

import { useKeyboardHeight } from "./use-keyboard-height";

/** Gestionnaire d'événement clavier réduit à ce que le hook consomme. */
type KeyboardHandler = (event: { endCoordinates: { height: number } }) => void;

/** Gestionnaires enregistrés, indexés par nom d'événement. */
const listeners = new Map<string, KeyboardHandler>();

/** Retrait d'un écouteur, partagé par les deux abonnements du hook. */
const remove = jest.fn();

/** Remplace l'écouteur natif du clavier par une table de gestionnaires. */
function captureKeyboardListeners(): void {
  jest.spyOn(Keyboard, "addListener").mockImplementation(((
    event: string,
    handler: KeyboardHandler,
  ) => {
    listeners.set(event, handler);
    return { remove };
  }) as unknown as typeof Keyboard.addListener);
}

describe("useKeyboardHeight", () => {
  const initialPlatform = Platform.OS;

  beforeEach(() => {
    listeners.clear();
    remove.mockClear();
    captureKeyboardListeners();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    (Platform as { OS: string }).OS = initialPlatform;
  });

  it("suit la hauteur du clavier sur iOS", async () => {
    const { result, unmount } = await renderHook(() => useKeyboardHeight());

    expect(result.current).toBe(0);

    await act(async () => {
      listeners.get("keyboardWillShow")?.({ endCoordinates: { height: 320 } });
    });
    expect(result.current).toBe(320);

    await act(async () => {
      listeners.get("keyboardWillHide")?.({ endCoordinates: { height: 0 } });
    });
    expect(result.current).toBe(0);

    await unmount();
    expect(remove).toHaveBeenCalledTimes(2);
  });

  it("écoute les événements Android", async () => {
    (Platform as { OS: string }).OS = "android";
    const { result } = await renderHook(() => useKeyboardHeight());

    await act(async () => {
      listeners.get("keyboardDidShow")?.({ endCoordinates: { height: 280 } });
    });

    expect(result.current).toBe(280);
  });
});
