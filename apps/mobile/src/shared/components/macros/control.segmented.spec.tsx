import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SegmentedControl } from "./control.segmented";

const OPTIONS = [
  { value: "active", label: "Actives" },
  { value: "completed", label: "Archivées" },
] as const;

describe("SegmentedControl", () => {
  it("marque l'option courante comme sélectionnée", async () => {
    await renderWithSafeArea(
      <SegmentedControl options={OPTIONS} value="active" onChange={jest.fn()} />,
    );

    expect(screen.getByRole("tab", { name: "Actives" })).toBeSelected();
    expect(screen.getByRole("tab", { name: "Archivées" })).not.toBeSelected();
  });

  it("remonte la valeur de l'option pressée", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SegmentedControl options={OPTIONS} value="active" onChange={onChange} />,
    );

    fireEvent.press(screen.getByRole("tab", { name: "Archivées" }));

    expect(onChange).toHaveBeenCalledWith("completed");
  });
});
