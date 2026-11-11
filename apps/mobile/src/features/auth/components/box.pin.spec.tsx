import { render, screen } from "@testing-library/react-native";

import { PinBox } from "./box.pin";

describe("PinBox", () => {
  it("masque le chiffre saisi", async () => {
    await render(<PinBox index={0} value="7" active={false} />);

    expect(screen.getByTestId("pin-box-0")).toHaveTextContent("•");
    expect(screen.queryByText("7")).toBeNull();
  });

  it("reste vide tant qu'aucun chiffre n'est saisi", async () => {
    await render(<PinBox index={2} active />);

    expect(screen.getByTestId("pin-box-2")).not.toHaveTextContent("•");
  });
});
