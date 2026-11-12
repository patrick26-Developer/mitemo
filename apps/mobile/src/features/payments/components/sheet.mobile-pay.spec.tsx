import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { MobilePaySheet } from "./sheet.mobile-pay";
import type { MobilePayRequest } from "./sheet.mobile-pay";
import { SIMULATED_CONFIRMATION_MS } from "../api/api.operator-confirmation";

jest.mock("../../auth", () => {
  const { Pressable, Text } = jest.requireActual("react-native");

  return {
    PinConfirm: ({ onConfirmed }: { onConfirmed: () => void }) => (
      <Pressable accessibilityRole="button" accessibilityLabel="Code juste" onPress={onConfirmed}>
        <Text>Pavé du code PIN</Text>
      </Pressable>
    ),
  };
});

/** Pointage de test : 5 000 FCFA sur la carte « Loyer ». */
const REQUEST: MobilePayRequest = {
  title: "Pointer",
  recapTitle: "Pointage",
  rows: [{ label: "Carte", value: "Loyer" }],
  amount: 5_000n,
};

describe("MobilePaySheet", () => {
  beforeEach(() => {
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
  });

  it("propose trois boutons de paiement, sans étapes ni bouton Annuler", async () => {
    await renderWithSafeArea(
      <MobilePaySheet visible request={REQUEST} onClose={jest.fn()} onPay={jest.fn()} />,
    );

    expect(screen.getByText("Loyer")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Payer avec MTN MoMo" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Payer avec Airtel Money" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Payer avec Mitemo" })).toBeOnTheScreen();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });

  it("attend que le serveur confirme le paiement Airtel, sans code PIN ni déclaration du membre", async () => {
    const onPay = jest.fn();
    const onClose = jest.fn();
    await renderWithSafeArea(
      <MobilePaySheet visible request={REQUEST} onClose={onClose} onPay={onPay} />,
    );

    jest.useFakeTimers();

    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Airtel Money" }));

    expect(
      screen.getByRole("header", { name: "En attente de validation Airtel Money" }),
    ).toBeOnTheScreen();
    expect(screen.getByText(/Composez \*128#/)).toBeOnTheScreen();
    expect(screen.queryByText("Pavé du code PIN")).toBeNull();
    expect(screen.queryByRole("button", { name: /J'ai validé/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
    expect(onPay).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(onPay).toHaveBeenCalledWith("AIRTEL_MONEY");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("demande le code PIN pour payer depuis Mitemo", async () => {
    const onPay = jest.fn();
    await renderWithSafeArea(
      <MobilePaySheet visible request={REQUEST} onClose={jest.fn()} onPay={onPay} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Mitemo" }));
    expect(screen.getByText(/code PIN Mitemo pour payer 5 000 FCFA/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(onPay).toHaveBeenCalledWith("MITEMO");
  });

  it("revient au choix du moyen sans payer", async () => {
    const onPay = jest.fn();
    await renderWithSafeArea(
      <MobilePaySheet visible request={REQUEST} onClose={jest.fn()} onPay={onPay} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Mitemo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(screen.getByRole("button", { name: "Payer avec Mitemo" })).toBeOnTheScreen();
    expect(onPay).not.toHaveBeenCalled();
  });

  it("ne remplit que « Payer avec Mitemo », les opérateurs restent en contour", async () => {
    await renderWithSafeArea(
      <MobilePaySheet
        visible
        request={{ ...REQUEST, accent: "#CDF5DD" }}
        onClose={jest.fn()}
        onPay={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId("sheet-primary-accent")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Payer avec MTN MoMo" })).toHaveStyle({
      borderColor: "#2AD56E",
    });
  });
});

afterEach(() => {
  jest.useRealTimers();
});
