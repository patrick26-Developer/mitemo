import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ConfirmSheet } from "./sheet.confirm";

/** Contenu de confirmation employé par les tests. */
const CONTENT = {
  title: "Retirer ce membre ?",
  message: "Il perdra l'accès à la tontine et à ses cotisations en cours.",
  confirmLabel: "Retirer",
} as const;

describe("ConfirmSheet", () => {
  it("affiche le titre, le message et l'action principale", async () => {
    await renderWithSafeArea(
      <ConfirmSheet content={CONTENT} visible onClose={jest.fn()} onConfirm={jest.fn()} />,
    );

    expect(screen.getByRole("header", { name: CONTENT.title })).toBeOnTheScreen();
    expect(screen.getByText(CONTENT.message)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: CONTENT.confirmLabel })).toBeOnTheScreen();
  });

  it("appelle la confirmation quand l'action principale est touchée", async () => {
    const onConfirm = jest.fn();
    await renderWithSafeArea(
      <ConfirmSheet content={CONTENT} visible onClose={jest.fn()} onConfirm={onConfirm} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: CONTENT.confirmLabel }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("se ferme par sa croix, sans bouton Annuler", async () => {
    await renderWithSafeArea(
      <ConfirmSheet content={CONTENT} visible onClose={jest.fn()} onConfirm={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Fermer" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });

  it("ne rend rien quand elle est fermée", async () => {
    await renderWithSafeArea(
      <ConfirmSheet content={CONTENT} visible={false} onClose={jest.fn()} onConfirm={jest.fn()} />,
    );

    expect(screen.queryByText(CONTENT.message)).not.toBeOnTheScreen();
  });
});
