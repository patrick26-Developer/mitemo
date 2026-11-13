import { act, screen } from "@testing-library/react-native";

import { playFeedbackSound } from "../../feedback/api.feedback-effects";
import { useCelebrationStore } from "../../feedback/store.celebration";
import {
  INITIAL_FEEDBACK_PREFERENCES,
  useFeedbackPreferences,
} from "../../feedback/store.feedback-preferences";
import { useMoneyFlightStore } from "../../feedback/store.money-flight";
import { FLIGHT_MS } from "../../model/model.money-flight";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { MoneyFlightHost } from "./host.money-flight";

jest.mock("../../feedback/api.feedback-effects", () => ({
  playFeedbackSound: jest.fn(async () => true),
  playSuccessHaptic: jest.fn(async () => true),
}));

/**
 * Enregistre une cible qui se mesure au milieu de l'écran.
 */
function registerTarget(): void {
  useMoneyFlightStore.getState().registerTarget((done) => done({ x: 120, y: 260 }));
}

describe("MoneyFlightHost", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(playFeedbackSound).mockClear();
    useMoneyFlightStore.setState({ flight: null, landings: 0, measureTarget: null });
    useCelebrationStore.setState({ burst: null });
    useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("ne montre rien sans paiement", async () => {
    await renderWithSafeArea(<MoneyFlightHost />);

    expect(screen.queryByTestId("money-flight")).toBeNull();
  });

  it("fait voler le montant jusqu'à la somme, puis fait tinter les pièces et lance la fête", async () => {
    registerTarget();
    await renderWithSafeArea(<MoneyFlightHost />);

    await act(() => useMoneyFlightStore.getState().launch(5_500n));
    expect(screen.getByTestId("money-flight")).toBeOnTheScreen();
    expect(screen.getByText("+5 500 FCFA")).toBeOnTheScreen();
    expect(useCelebrationStore.getState().burst).toBeNull();

    await act(() => jest.advanceTimersByTime(FLIGHT_MS));
    expect(screen.queryByTestId("money-flight")).toBeNull();
    expect(useMoneyFlightStore.getState().landings).toBe(1);
    expect(playFeedbackSound).toHaveBeenCalledWith("coin");
    expect(useCelebrationStore.getState().burst).not.toBeNull();
  });

  it("fête tout de suite, sans vol, quand les animations sont coupées", async () => {
    registerTarget();
    useFeedbackPreferences.setState({ animations: false });
    await renderWithSafeArea(<MoneyFlightHost />);

    await act(() => useMoneyFlightStore.getState().launch(5_500n));

    expect(screen.queryByTestId("money-flight")).toBeNull();
    expect(useCelebrationStore.getState().burst).not.toBeNull();
  });

  it("fête tout de suite quand la somme n'est pas à l'écran", async () => {
    await renderWithSafeArea(<MoneyFlightHost />);

    await act(() => useMoneyFlightStore.getState().launch(5_500n));

    expect(screen.queryByTestId("money-flight")).toBeNull();
    expect(useMoneyFlightStore.getState().landings).toBe(1);
  });

  it("garde le silence quand le son est coupé", async () => {
    useFeedbackPreferences.setState({ sound: false });
    await renderWithSafeArea(<MoneyFlightHost />);

    await act(() => useMoneyFlightStore.getState().launch(5_500n));

    expect(playFeedbackSound).not.toHaveBeenCalled();
  });
});
