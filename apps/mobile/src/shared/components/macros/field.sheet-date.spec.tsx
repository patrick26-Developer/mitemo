import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { act, fireEvent, screen } from "@testing-library/react-native";
import { Platform } from "react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetDateField } from "./field.sheet-date";

/** Date choisie dans le calendrier simulé. */
const PICKED = new Date("2027-01-15T00:00:00.000Z");

describe("SheetDateField", () => {
  const initialPlatform = Platform.OS;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(DateTimePickerAndroid, "open").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    (Platform as { OS: string }).OS = initialPlatform;
    jest.restoreAllMocks();
  });

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

  it("ouvre le calendrier dans une seconde feuille et retient le jour touché, sans valider à part", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByTestId("sheet-date-trigger"));

    expect(screen.getByRole("header", { name: "Échéance" })).toBeOnTheScreen();
    expect(screen.getByText("Date retenue")).toBeOnTheScreen();

    await fireEvent(screen.getByTestId("native-date-picker"), "change", { type: "set" }, PICKED);

    expect(onChange).toHaveBeenCalledWith("2027-01-15");
    expect(screen.queryByTestId("native-date-picker")).not.toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Annuler" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Valider" })).toBeNull();
  });

  it("referme le calendrier par la croix de sa feuille sans rien changer", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByTestId("sheet-date-trigger"));
    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));
    await act(() => jest.runAllTimersAsync());

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId("native-date-picker")).not.toBeOnTheScreen();
  });

  it("ouvre le calendrier natif d'Android une seule fois et retient la date validée", async () => {
    (Platform as { OS: string }).OS = "android";
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByTestId("sheet-date-trigger"));

    const open = jest.mocked(DateTimePickerAndroid.open);
    expect(open).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("native-date-picker")).not.toBeOnTheScreen();
    const options = open.mock.calls[0]?.[0];
    expect(options?.value).toEqual(new Date("2026-12-01T00:00:00.000Z"));
    options?.onChange?.(
      { type: "set", nativeEvent: { timestamp: PICKED.getTime(), utcOffset: 0 } },
      PICKED,
    );
    expect(onChange).toHaveBeenCalledWith("2027-01-15");
  });

  it("ne retient rien quand le calendrier d'Android est fermé sans choix", async () => {
    (Platform as { OS: string }).OS = "android";
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetDateField label="Échéance" value="" minimum="2026-12-01" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByTestId("sheet-date-trigger"));
    const options = jest.mocked(DateTimePickerAndroid.open).mock.calls[0]?.[0];
    options?.onChange?.(
      { type: "dismissed", nativeEvent: { timestamp: 0, utcOffset: 0 } },
      undefined,
    );

    expect(onChange).not.toHaveBeenCalled();
  });
});
