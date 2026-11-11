import { render, screen } from "@testing-library/react-native";

import { PinRow } from "./row.pin";

describe("PinRow", () => {
  it("masque les chiffres déjà saisis et laisse les autres vides", async () => {
    await render(<PinRow pin="12" />);

    expect(screen.getByTestId("pin-box-0")).toHaveTextContent("•");
    expect(screen.getByTestId("pin-box-1")).toHaveTextContent("•");
    expect(screen.getByTestId("pin-box-2")).not.toHaveTextContent("•");
    expect(screen.getByTestId("pin-box-3")).not.toHaveTextContent("•");
  });
});
