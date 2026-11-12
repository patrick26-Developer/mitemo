import { act, renderHook } from "@testing-library/react-native";
import { Keyboard, LayoutAnimation, Platform } from "react-native";
import { KeyboardEvents } from "react-native-keyboard-controller";

import { useKeyboardHeight } from "./hook.keyboard-height";

/** Gestionnaire capturé : reçoit l'événement tel que la source l'envoie. */
type Handler = (event: unknown) => void;

/** Gestionnaires enregistrés, indexés par source puis par nom d'événement. */
const listeners = new Map<string, Handler>();

/** Retrait d'un écouteur, partagé par les abonnements du hook. */
const remove = jest.fn();

/**
 * Capture les écouteurs d'une source d'événements clavier.
 * @param source Préfixe de la source, `rn` ou `kc`.
 * @returns L'implémentation d'`addListener` qui les enregistre.
 */
function capture(source: string) {
  return ((name: string, handler: Handler) => {
    listeners.set(`${source}:${name}`, handler);
    return { remove };
  }) as never;
}

/**
 * Émet un événement capturé.
 * @param key Source et nom, par exemple `rn:keyboardWillShow`.
 * @param event Données de l'événement.
 */
async function emit(key: string, event: unknown): Promise<void> {
  await act(async () => {
    listeners.get(key)?.(event);
  });
}

describe("useKeyboardHeight", () => {
  const initialPlatform = Platform.OS;

  beforeEach(() => {
    listeners.clear();
    remove.mockClear();
    jest.spyOn(Keyboard, "addListener").mockImplementation(capture("rn"));
    jest.spyOn(KeyboardEvents, "addListener").mockImplementation(capture("kc"));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    (Platform as { OS: string }).OS = initialPlatform;
  });

  it("suit le clavier d'iOS avec les événements de React Native, comme avant", async () => {
    (Platform as { OS: string }).OS = "ios";
    const schedule = jest.spyOn(Keyboard, "scheduleLayoutAnimation").mockImplementation(() => {});
    const { result, unmount } = await renderHook(() => useKeyboardHeight());

    const event = { endCoordinates: { height: 320 }, duration: 250 };
    await emit("rn:keyboardWillShow", event);
    expect(result.current).toBe(320);
    expect(schedule).toHaveBeenCalledWith(event);

    await emit("rn:keyboardWillHide", { endCoordinates: { height: 0 }, duration: 250 });
    expect(result.current).toBe(0);
    expect(listeners.has("kc:keyboardWillShow")).toBe(false);

    await unmount();
    expect(remove).toHaveBeenCalledTimes(2);
  });

  it("suit le clavier d'Android avec keyboard-controller, qui part aussi dans une feuille", async () => {
    (Platform as { OS: string }).OS = "android";
    const configure = jest.spyOn(LayoutAnimation, "configureNext").mockImplementation(() => {});
    const { result } = await renderHook(() => useKeyboardHeight());

    await emit("kc:keyboardWillShow", { height: 280, duration: 200 });
    expect(result.current).toBe(280);
    await emit("kc:keyboardWillHide", { height: 0, duration: 200 });
    expect(result.current).toBe(0);

    expect(configure).not.toHaveBeenCalled();
    expect(listeners.has("rn:keyboardWillShow")).toBe(false);
  });
});
