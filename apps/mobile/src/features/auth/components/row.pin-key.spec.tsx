import { fireEvent, render, screen } from "@testing-library/react-native";

import { PinKeyRow } from "./row.pin-key";

describe("PinKeyRow", () => {
  it("affiche une touche par chiffre de la rangée", async () => {
    const onPressDigit = jest.fn();
    await render(<PinKeyRow row={["4", "5", "6"]} onPressDigit={onPressDigit} />);

    await fireEvent.press(screen.getByRole("button", { name: "6" }));

    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(onPressDigit).toHaveBeenCalledWith("6");
  });
});
