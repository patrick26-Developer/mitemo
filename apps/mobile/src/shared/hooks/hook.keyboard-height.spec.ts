import { act, renderHook } from "@testing-library/react-native";
import { LayoutAnimation, Platform } from "react-native";
import { KeyboardEvents } from "react-native-keyboard-controller";

import { useKeyboardHeight } from "./hook.keyboard-height";

/** Données d'un événement clavier réduites à ce que le hook consomme. */
interface KeyboardData {
  readonly height: number;
  readonly duration: number;
}

/** Gestionnaire d'événement clavier. */
type KeyboardHandler = (event: KeyboardData) => void;

/** Gestionnaires enregistrés, indexés par nom d'événement. */
const listeners = new Map<string, KeyboardHandler>();

/** Retrait d'un écouteur, partagé par les deux abonnements du hook. */
const remove = jest.fn();

/** Remplace l'écouteur natif du clavier par une table de gestionnaires. */
function captureKeyboardListeners(): void {
  jest.spyOn(KeyboardEvents, "addListener").mockImplementation(((
    event: string,
    handler: KeyboardHandler,
  ) => {
    listeners.set(event, handler);
    return { remove };
  }) as unknown as typeof KeyboardEvents.addListener);
}

/**
 * Émet un événement clavier capturé.
 * @param name Nom de l'événement.
 * @param event Hauteur et durée.
 */
async function emit(name: string, event: KeyboardData): Promise<void> {
  await act(async () => {
    listeners.get(name)?.(event);
  });
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

  it("suit la hauteur du clavier, de son ouverture à sa fermeture", async () => {
    const { result, unmount } = await renderHook(() => useKeyboardHeight());
    expect(result.current).toBe(0);

    await emit("keyboardWillShow", { height: 320, duration: 250 });
    expect(result.current).toBe(320);
    await emit("keyboardWillHide", { height: 0, duration: 250 });
    expect(result.current).toBe(0);

    await unmount();
    expect(remove).toHaveBeenCalledTimes(2);
  });

  it("lève la feuille avant l'arrivée du clavier sur Android aussi, même dans une feuille", async () => {
    (Platform as { OS: string }).OS = "android";
    const { result } = await renderHook(() => useKeyboardHeight());

    await emit("keyboardWillShow", { height: 280, duration: 200 });

    expect(result.current).toBe(280);
  });

  it("fait glisser la carte au rythme du clavier", async () => {
    const configure = jest.spyOn(LayoutAnimation, "configureNext").mockImplementation(() => {});
    await renderHook(() => useKeyboardHeight());

    await emit("keyboardWillShow", { height: 320, duration: 250 });

    expect(configure).toHaveBeenCalledWith(LayoutAnimation.create(250, "easeInEaseOut", "opacity"));
  });

  it("n'anime pas la mise en page sur Android, où l'animation effaçait la feuille", async () => {
    (Platform as { OS: string }).OS = "android";
    const configure = jest.spyOn(LayoutAnimation, "configureNext").mockImplementation(() => {});
    const { result } = await renderHook(() => useKeyboardHeight());

    await emit("keyboardWillShow", { height: 280, duration: 200 });

    expect(result.current).toBe(280);
    expect(configure).not.toHaveBeenCalled();
  });

  it("adoucit le changement quand le clavier ne donne pas de durée", async () => {
    const configure = jest.spyOn(LayoutAnimation, "configureNext").mockImplementation(() => {});
    await renderHook(() => useKeyboardHeight());

    await emit("keyboardWillShow", { height: 280, duration: 0 });

    expect(configure).toHaveBeenCalledWith(LayoutAnimation.Presets.easeInEaseOut);
  });
});
