import { fireEvent, render, screen } from "@testing-library/react-native";
import { Bell } from "lucide-react-native";

import { SheetRow } from "./row.sheet";

describe("SheetRow", () => {
  it("affiche libellé, description et valeur, et réagit au toucher", async () => {
    const onPress = jest.fn();
    await render(
      <SheetRow
        label="Airtel Money"
        description="Moyen principal"
        value="06 512 34 56"
        icon={Bell}
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Airtel Money" }));

    expect(screen.getByText("Moyen principal")).toBeOnTheScreen();
    expect(screen.getByText("06 512 34 56")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("expose la sélection", async () => {
    await render(<SheetRow label="Airtel Money" selected />);

    expect(screen.getByRole("button", { name: "Airtel Money" })).toBeSelected();
  });

  it("n'est pas sélectionnée par défaut", async () => {
    await render(<SheetRow label="MTN Mobile Money" />);

    expect(screen.getByRole("button", { name: "MTN Mobile Money" })).not.toBeSelected();
  });
});
