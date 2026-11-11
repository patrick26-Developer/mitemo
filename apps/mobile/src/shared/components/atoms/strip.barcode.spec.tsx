import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { BarcodeStrip } from "./strip.barcode";

describe("BarcodeStrip", () => {
  it("se rend dans la couleur demandée", async () => {
    await render(
      <View testID="barcode">
        <BarcodeStrip color="#000000" height={10} />
      </View>,
    );

    expect(screen.getByTestId("barcode")).toBeOnTheScreen();
  });
});
