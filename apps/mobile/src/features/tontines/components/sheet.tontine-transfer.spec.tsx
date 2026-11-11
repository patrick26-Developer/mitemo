import { fireEvent, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineTransferSheet } from "./sheet.tontine-transfer";

/**
 * Ouvre la feuille de transfert d'une tontine de test.
 * @param onTransfer Résultat du transfert demandé.
 * @returns La fonction de fermeture observée.
 */
async function renderSheet(onTransfer: (memberId: string, amount: bigint) => boolean) {
  const onClose = jest.fn();
  await renderWithSafeArea(
    <TontineTransferSheet visible item={makeTontine()} onClose={onClose} onTransfer={onTransfer} />,
  );

  return onClose;
}

describe("TontineTransferSheet", () => {
  it("ne propose pas de se transférer à soi-même", async () => {
    await renderSheet(jest.fn());

    expect(screen.queryByRole("button", { name: "Membre self" })).toBeNull();
    expect(screen.getByRole("button", { name: "Membre m2" })).toBeOnTheScreen();
  });

  it("exige un destinataire", async () => {
    await renderSheet(jest.fn());

    await fireEvent.press(screen.getByRole("button", { name: "Transférer" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Choisissez un destinataire.");
  });

  it("transfère le montant puis se ferme", async () => {
    const onTransfer = jest.fn(() => true);
    const onClose = await renderSheet(onTransfer);

    await fireEvent.press(screen.getByRole("button", { name: "Membre m2" }));
    await fireEvent.changeText(screen.getByLabelText("Montant (FCFA)"), "2500");
    await fireEvent.press(screen.getByRole("button", { name: "Transférer" }));

    expect(onTransfer).toHaveBeenCalledWith("m2", 2_500n);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("signale un transfert refusé sans fermer", async () => {
    const onClose = await renderSheet(() => false);

    await fireEvent.press(screen.getByRole("button", { name: "Membre m2" }));
    await fireEvent.changeText(screen.getByLabelText("Montant (FCFA)"), "2500");
    await fireEvent.press(screen.getByRole("button", { name: "Transférer" }));

    expect(screen.getByRole("alert")).toHaveTextContent(/vérifiez votre solde/);
    expect(onClose).not.toHaveBeenCalled();
  });
});
