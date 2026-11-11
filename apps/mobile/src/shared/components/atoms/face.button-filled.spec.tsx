import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { FilledButtonFace } from "./face.button-filled";

describe("FilledButtonFace", () => {
  it("borde le fond de sa propre couleur, avec le grain et le libellé", async () => {
    await renderWithSafeArea(
      <FilledButtonFace label="Payer" colors={{ background: "#083EDF", foreground: "#FFFFFF" }} />,
    );

    expect(screen.getByTestId("filled-button-face")).toHaveStyle({
      backgroundColor: "#083EDF",
      borderColor: "#083EDF",
    });
    expect(screen.getByTestId("noise-pattern")).toBeOnTheScreen();
    expect(screen.getByText("Payer")).toHaveStyle({ color: "#FFFFFF" });
  });
});
