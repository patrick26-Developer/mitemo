import { act, fireEvent, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontinePaySheet } from "./sheet.tontine-pay";
import { SIMULATED_CONFIRMATION_MS } from "../../payments";

jest.mock("../../auth", () => ({ PinConfirm: () => null }));

/** Tontine de test : 5 000 FCFA par tour, au tour 2. */
const TONTINE = makeTontine({ name: "Les Amis", contribution: 5_000n, round: 2 });

describe("TontinePaySheet", () => {
  it("récapitule la cotisation du tour et propose les trois moyens", async () => {
    await renderWithSafeArea(
      <TontinePaySheet visible item={TONTINE} onClose={jest.fn()} onPay={jest.fn()} />,
    );

    expect(screen.getByRole("header", { name: "Cotiser" })).toBeOnTheScreen();
    expect(screen.getByText("Les Amis")).toBeOnTheScreen();
    expect(screen.getByText("2 sur 3")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Payer avec Mitemo" })).toBeOnTheScreen();
  });

  it("règle la cotisation par MTN MoMo une fois validée sur le téléphone", async () => {
    const onPay = jest.fn();
    await renderWithSafeArea(
      <TontinePaySheet visible item={TONTINE} onClose={jest.fn()} onPay={onPay} />,
    );

    jest.useFakeTimers();

    await fireEvent.press(screen.getByRole("button", { name: "Payer avec MTN MoMo" }));
    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(onPay).toHaveBeenCalledWith("MTN_MOMO");
  });
});

afterEach(() => {
  jest.useRealTimers();
});
