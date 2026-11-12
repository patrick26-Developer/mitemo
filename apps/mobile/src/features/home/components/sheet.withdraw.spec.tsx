import { fireEvent, screen } from "@testing-library/react-native";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { WithdrawSheet } from "./sheet.withdraw";

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

describe("WithdrawSheet", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ available: 20_000n });
  });

  it("retire le montant vers l'opérateur choisi, une fois le code PIN saisi", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<WithdrawSheet visible onClose={onClose} />);

    await fireEvent.changeText(screen.getByLabelText("Montant (FCFA)"), "5000");
    await fireEvent.press(screen.getByRole("button", { name: "Retirer vers Airtel Money" }));
    expect(usePortfolioStore.getState().available).toBe(20_000n);
    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(usePortfolioStore.getState().available).toBe(15_000n);
    expect(useToastStore.getState().toast?.message).toMatch(
      /^Retrait de 5.000 FCFA vers Airtel Money lancé\.$/,
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n'a aucun bouton Retour au code PIN", async () => {
    await renderWithSafeArea(<WithdrawSheet visible onClose={jest.fn()} />);

    await fireEvent.changeText(screen.getByLabelText("Montant (FCFA)"), "5000");
    await fireEvent.press(screen.getByRole("button", { name: "Retirer vers MTN MoMo" }));

    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
    expect(usePortfolioStore.getState().available).toBe(20_000n);
  });

  it("refuse un montant supérieur au solde sans demander le code", async () => {
    await renderWithSafeArea(<WithdrawSheet visible onClose={jest.fn()} />);

    await fireEvent.changeText(screen.getByLabelText("Montant (FCFA)"), "30000");
    await fireEvent.press(screen.getByRole("button", { name: "Retirer vers MTN MoMo" }));

    expect(useToastStore.getState().toast?.message).toBe("Votre solde disponible est insuffisant.");
    expect(screen.queryByRole("button", { name: "Code juste" })).toBeNull();
  });
});
