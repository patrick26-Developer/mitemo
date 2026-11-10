import { fireEvent, screen } from "@testing-library/react-native";
import { Bell } from "lucide-react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetSwitchRow } from "./row.sheet-switch";

describe("SheetSwitchRow", () => {
  it("affiche le libellé et sa description", async () => {
    await renderWithSafeArea(
      <SheetSwitchRow
        label="Cotisations"
        description="Rappels avant chaque échéance"
        value
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByText("Cotisations")).toBeOnTheScreen();
    expect(screen.getByText("Rappels avant chaque échéance")).toBeOnTheScreen();
  });

  it("annonce l'état du commutateur", async () => {
    await renderWithSafeArea(
      <SheetSwitchRow
        label="Cotisations"
        description="Rappels"
        value={false}
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Cotisations")).not.toBeChecked();
  });

  it("transmet le changement de valeur", async () => {
    const onValueChange = jest.fn();
    await renderWithSafeArea(
      <SheetSwitchRow
        label="Cotisations"
        description="Rappels"
        value={false}
        onValueChange={onValueChange}
      />,
    );

    fireEvent(screen.getByLabelText("Cotisations"), "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("accepte une icône à gauche du libellé", async () => {
    await renderWithSafeArea(
      <SheetSwitchRow
        icon={Bell}
        label="Déverrouillage biométrique"
        description="Empreinte ou reconnaissance faciale"
        value
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Déverrouillage biométrique")).toBeOnTheScreen();
  });
});
