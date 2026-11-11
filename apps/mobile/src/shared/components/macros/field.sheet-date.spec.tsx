import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetDateField } from "./field.sheet-date";

describe("SheetDateField", () => {
  it("invite à choisir une date quand aucune n'est prise", async () => {
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={jest.fn()} />,
    );

    expect(screen.getByLabelText("Échéance : aucune date")).toBeOnTheScreen();
    expect(screen.getByText("Choisir une date")).toBeOnTheScreen();
  });

  it("affiche la date déjà choisie", async () => {
    await renderWithSafeArea(
      <SheetDateField
        label="Échéance"
        value="2027-02-28"
        minimum="2026-12-01"
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Échéance : 28/02/2027")).toBeOnTheScreen();
  });

  it("ouvre le calendrier et valide la date proposée", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByTestId("sheet-date-trigger"));

    expect(screen.getByTestId("sheet-date-menu")).toBeOnTheScreen();
    expect(screen.getByTestId("native-date-picker")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Valider" }));

    expect(onChange).toHaveBeenCalledWith("2026-12-01");
    expect(screen.queryByTestId("sheet-date-menu")).not.toBeOnTheScreen();
  });

  it("n'enregistre rien quand le calendrier est annulé", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByTestId("sheet-date-trigger"));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId("sheet-date-menu")).not.toBeOnTheScreen();
  });
});
