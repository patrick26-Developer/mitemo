import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../testing/render-with-safe-area";
import { AmountText } from "./amount-text";

describe("AmountText", () => {
  it("sépare les milliers et rappelle la devise", async () => {
    await renderWithSafeArea(<AmountText amount={30_000n} />);

    expect(screen.getByText(/30 000/)).toBeOnTheScreen();
    expect(screen.getByText("FCFA")).toBeOnTheScreen();
  });
});
