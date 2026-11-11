import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { RadialCard } from "./card.radial";

describe("RadialCard", () => {
  it("affiche son contenu par-dessus le dégradé", async () => {
    await render(
      <RadialCard width={300} colors={["#2CCA86", "#62F79D"]}>
        <Text>Tontine du marché</Text>
      </RadialCard>,
    );

    expect(screen.getByText("Tontine du marché")).toBeOnTheScreen();
  });
});
