import { act, fireEvent, screen } from "@testing-library/react-native";

import { useToastStore } from "../../feedback/store.toast";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { TOAST_DURATION_MS, ToastHost } from "./host.toast";

describe("ToastHost", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useToastStore.getState().dismiss();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("ne rend rien sans toast", async () => {
    await renderWithSafeArea(<ToastHost />);

    expect(screen.queryByRole("alert")).not.toBeOnTheScreen();
  });

  it("annonce le message puis le retire de lui-même", async () => {
    await renderWithSafeArea(<ToastHost />);

    await act(() => useToastStore.getState().show("error", "Votre solde est insuffisant."));
    expect(screen.getByRole("alert", { name: "Votre solde est insuffisant." })).toBeOnTheScreen();

    await act(() => jest.advanceTimersByTime(TOAST_DURATION_MS));
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("se ferme au toucher", async () => {
    await renderWithSafeArea(<ToastHost />);
    await act(() => useToastStore.getState().show("success", "Pointage réglé."));

    await fireEvent.press(screen.getByRole("alert"));

    expect(useToastStore.getState().toast).toBeNull();
  });

  it("pose un succès sur une carte blanche, comme les feuilles", async () => {
    await renderWithSafeArea(<ToastHost />);
    await act(() => useToastStore.getState().show("success", "Pointage réglé."));

    expect(screen.getByRole("alert")).toHaveStyle({ backgroundColor: "#FFFFFF" });
  });

  it("pose une erreur sur une carte toute rouge", async () => {
    await renderWithSafeArea(<ToastHost />);
    await act(() => useToastStore.getState().show("error", "Votre solde est insuffisant."));

    expect(screen.getByRole("alert")).toHaveStyle({ backgroundColor: "#B42318" });
  });
});
