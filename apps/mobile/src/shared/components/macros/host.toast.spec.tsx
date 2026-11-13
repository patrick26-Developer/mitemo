import { act, fireEvent, screen } from "@testing-library/react-native";

import { useToastStore } from "../../feedback/store.toast";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { useMemberStore } from "../../member/store.member";
import { SUCCESS_TOAST_MS, toastDuration } from "../../model/model.toast-content";
import { signalError } from "../../feedback/api.error-feedback";
import { ToastHost } from "./host.toast";

jest.mock("../../feedback/api.error-feedback", () => ({ signalError: jest.fn() }));

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
    expect(screen.getByRole("alert", { name: /Votre solde est insuffisant\./ })).toBeOnTheScreen();

    await act(() => jest.advanceTimersByTime(toastDuration("error")));
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("fait sonner et vibrer une erreur, pas une réussite", async () => {
    jest.mocked(signalError).mockClear();
    await renderWithSafeArea(<ToastHost />);

    await act(() => useToastStore.getState().show("success", "Pointage réglé."));
    expect(signalError).not.toHaveBeenCalled();
    await act(() => useToastStore.getState().show("error", "Code incorrect."));
    expect(signalError).toHaveBeenCalledTimes(1);
  });

  it("se ferme au toucher", async () => {
    await renderWithSafeArea(<ToastHost />);
    await act(() => useToastStore.getState().show("success", "Pointage réglé."));

    await fireEvent.press(screen.getByRole("alert"));

    expect(useToastStore.getState().toast).toBeNull();
  });

  it("montre d'abord la photo du membre, un titre, puis la description, pendant une seconde", async () => {
    useMemberStore.setState({ name: "Espoir LOEMBA", avatarInitial: "E", photoUri: null });
    await renderWithSafeArea(<ToastHost />);
    await act(() => useToastStore.getState().show("success", "Pointage réglé."));

    expect(screen.getByTestId("toast-avatar")).toBeOnTheScreen();
    expect(screen.getByText("Bravo Espoir !")).toBeOnTheScreen();
    expect(screen.getByText("Pointage réglé.")).toBeOnTheScreen();

    await act(() => jest.advanceTimersByTime(SUCCESS_TOAST_MS));
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
    expect(screen.getByText("Un petit souci")).toBeOnTheScreen();
  });
});
