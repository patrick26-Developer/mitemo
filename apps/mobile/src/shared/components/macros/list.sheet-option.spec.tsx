import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetOptionList } from "./list.sheet-option";

/** Options de test, dont une porte une valeur secondaire. */
const OPTIONS = [
  { value: "airtel", label: "Airtel Money", detail: "06 512 34 56" },
  { value: "mtn", label: "MTN Mobile Money", detail: "05 478 90 12" },
] as const;

describe("SheetOptionList", () => {
  it("affiche toutes les options et leur détail", async () => {
    await renderWithSafeArea(
      <SheetOptionList options={OPTIONS} selected="airtel" onSelect={jest.fn()} />,
    );

    expect(screen.getByText("Airtel Money")).toBeOnTheScreen();
    expect(screen.getByText("MTN Mobile Money")).toBeOnTheScreen();
    expect(screen.getByText("06 512 34 56")).toBeOnTheScreen();
  });

  it("marque l'option courante", async () => {
    await renderWithSafeArea(
      <SheetOptionList options={OPTIONS} selected="mtn" onSelect={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "MTN Mobile Money" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Airtel Money" })).not.toBeSelected();
  });

  it("transmet le choix du membre", async () => {
    const onSelect = jest.fn();
    await renderWithSafeArea(
      <SheetOptionList options={OPTIONS} selected="airtel" onSelect={onSelect} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "MTN Mobile Money" }));

    expect(onSelect).toHaveBeenCalledWith("mtn");
  });
});
