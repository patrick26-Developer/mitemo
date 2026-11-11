import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { FIELD_CHROME } from "../../theme/theme.field";
import { SheetSelect } from "./field.sheet-select";

/** Groupes de test, sur deux unités. */
const GROUPS = [
  {
    title: "Au jour",
    options: [
      { value: "jour-1", label: "Chaque jour" },
      { value: "jour-2", label: "Tous les 2 jours" },
    ],
  },
  {
    title: "À la semaine",
    options: [{ value: "semaine-1", label: "Chaque semaine" }],
  },
] as const;

describe("SheetSelect", () => {
  it("affiche le libellé et la valeur choisie", async () => {
    await renderWithSafeArea(
      <SheetSelect label="Fréquence" groups={GROUPS} value="jour-2" onChange={jest.fn()} />,
    );

    expect(screen.getByLabelText("Fréquence : Tous les 2 jours")).toBeOnTheScreen();
  });

  it("ouvre la liste groupée au toucher", async () => {
    await renderWithSafeArea(
      <SheetSelect label="Fréquence" groups={GROUPS} value="jour-1" onChange={jest.fn()} />,
    );

    await fireEvent.press(screen.getByLabelText("Fréquence : Chaque jour"));

    expect(screen.getByText("Au jour")).toBeOnTheScreen();
    expect(screen.getByText("À la semaine")).toBeOnTheScreen();
    expect(screen.getByText("Chaque semaine")).toBeOnTheScreen();
  });

  it("transmet le choix et referme la liste", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetSelect label="Fréquence" groups={GROUPS} value="jour-1" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByLabelText("Fréquence : Chaque jour"));
    await fireEvent.press(screen.getByLabelText("Chaque semaine"));

    expect(onChange).toHaveBeenCalledWith("semaine-1");
    expect(screen.queryByTestId("sheet-select-menu")).not.toBeOnTheScreen();
  });

  it("dessine un anneau rouge sur un choix refusé", async () => {
    await renderWithSafeArea(
      <SheetSelect label="Fréquence" groups={GROUPS} value="jour-1" onChange={jest.fn()} invalid />,
    );

    expect(screen.getByTestId("sheet-select-trigger")).toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
      outlineColor: FIELD_CHROME.errorRing,
    });
  });
});
