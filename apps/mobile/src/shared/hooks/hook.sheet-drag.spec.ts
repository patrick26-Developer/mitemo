import { renderHook } from "@testing-library/react-native";
import { Animated, PanResponder } from "react-native";
import type {
  GestureResponderEvent,
  PanResponderCallbacks,
  PanResponderGestureState,
} from "react-native";

import { closeSheet, springBackSheet } from "../model/model.sheet-animation";
import { useSheetDrag } from "./hook.sheet-drag";

jest.mock("../model/model.sheet-animation", () => ({
  closeSheet: jest.fn(),
  springBackSheet: jest.fn(),
}));

/** Rappels du geste, tous présents. */
type SheetCallbacks = {
  readonly [Key in keyof PanResponderCallbacks]-?: NonNullable<PanResponderCallbacks[Key]>;
};

/** Événement tactile neutre, jamais lu par le hook. */
const EVENT = {} as GestureResponderEvent;

/**
 * Geste de test, complété par des valeurs nulles.
 * @param gesture Déplacement et vitesse à simuler.
 * @returns L'état complet du geste.
 */
function gestureOf(gesture: Partial<PanResponderGestureState>): PanResponderGestureState {
  return {
    stateID: 1,
    moveX: 0,
    moveY: 0,
    x0: 0,
    y0: 0,
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    numberActiveTouches: 1,
    ...gesture,
  };
}

/**
 * Monte le hook et capture la configuration du geste qu'il crée.
 * @returns La position animée, la fermeture et les rappels du geste.
 */
async function setup() {
  const create = jest.spyOn(PanResponder, "create");
  const translateY = new Animated.Value(0);
  const onClose = jest.fn();
  await renderHook(() => useSheetDrag(translateY, onClose));
  const callbacks = create.mock.calls.at(-1)?.[0] as SheetCallbacks;

  return { translateY, onClose, callbacks };
}

describe("useSheetDrag", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ne prend la main que pour un geste vertical vers le bas", async () => {
    const { callbacks } = await setup();

    expect(callbacks.onMoveShouldSetPanResponder(EVENT, gestureOf({ dy: 20, dx: 2 }))).toBe(true);
    expect(callbacks.onMoveShouldSetPanResponder(EVENT, gestureOf({ dy: 2 }))).toBe(false);
    expect(callbacks.onMoveShouldSetPanResponder(EVENT, gestureOf({ dy: 10, dx: 30 }))).toBe(false);
  });

  it("suit le doigt vers le bas, jamais vers le haut", async () => {
    const { callbacks, translateY } = await setup();
    const setValue = jest.spyOn(translateY, "setValue");

    callbacks.onPanResponderMove(EVENT, gestureOf({ dy: 40 }));
    callbacks.onPanResponderMove(EVENT, gestureOf({ dy: -40 }));

    expect(setValue.mock.calls).toEqual([[40]]);
  });

  it("ferme la feuille après un glissement franc", async () => {
    const { callbacks, translateY, onClose } = await setup();

    callbacks.onPanResponderRelease(EVENT, gestureOf({ dy: 400, vy: 2 }));

    expect(closeSheet).toHaveBeenCalledWith(translateY, onClose);
  });

  it("remet la feuille en place après un petit glissement ou une interruption", async () => {
    const { callbacks, translateY } = await setup();

    callbacks.onPanResponderRelease(EVENT, gestureOf({ dy: 10, vy: 0 }));
    callbacks.onPanResponderTerminate(EVENT, gestureOf({}));

    expect(springBackSheet).toHaveBeenCalledTimes(2);
    expect(springBackSheet).toHaveBeenCalledWith(translateY);
    expect(closeSheet).not.toHaveBeenCalled();
  });
});
