import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ActionsDock } from "./dock.actions";

describe("ActionsDock", () => {
  it("affiche l'action principale et l'action secondaire", async () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    await renderWithSafeArea(
      <ActionsDock
        primary={{ label: "Pointer 5 000 FCFA", onPress: onPrimary }}
        secondary={{ label: "Retirer", onPress: onSecondary }}
      />,
    );

    expect(screen.getByTestId("actions-dock")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 000 FCFA" }));
    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));

    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it("prend toute la largeur quand seule l'action secondaire existe", async () => {
    await renderWithSafeArea(
      <ActionsDock primary={null} secondary={{ label: "Transférer", onPress: jest.fn() }} />,
    );

    expect(screen.getByRole("button", { name: "Transférer" })).toBeOnTheScreen();
  });

  it("flotte sans fond, en laissant passer les touchers autour des boutons", async () => {
    await renderWithSafeArea(<ActionsDock primary={{ label: "Pointer", onPress: jest.fn() }} />);

    const dock = screen.getByTestId("actions-dock");
    expect(dock).not.toHaveStyle({ backgroundColor: "#FFFFFF" });
    expect(dock.props["pointerEvents"]).toBe("box-none");
  });

  it("affiche le retour d'opération au-dessus des actions", async () => {
    await renderWithSafeArea(
      <ActionsDock
        primary={{ label: "Pointer", onPress: jest.fn() }}
        notice={{ kind: "success", message: "Pointage ajouté." }}
      />,
    );

    expect(screen.getByText("Pointage ajouté.")).toBeOnTheScreen();
  });

  it("affiche le retour même quand plus aucune action n'est possible", async () => {
    await renderWithSafeArea(
      <ActionsDock
        primary={null}
        secondary={null}
        notice={{ kind: "success", message: "L'épargne a été retirée." }}
      />,
    );

    expect(screen.getByText("L'épargne a été retirée.")).toBeOnTheScreen();
  });

  it("ne rend rien sans action ni retour", async () => {
    await renderWithSafeArea(<ActionsDock primary={null} secondary={null} />);

    expect(screen.queryByTestId("actions-dock")).not.toBeOnTheScreen();
  });
});
