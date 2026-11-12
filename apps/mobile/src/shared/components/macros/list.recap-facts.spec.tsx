import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { RecapFactList } from "./list.recap-facts";

describe("RecapFactList", () => {
  it("rend chaque ligne avec son icône, séparée de la suivante par un trait", async () => {
    await render(
      <RecapFactList
        rows={[
          { id: "pot", label: "Restourne", value: "10 000 FCFA", icon: <Text>i1</Text> },
          { id: "beneficiary", label: "Bénéficiaire", value: "Aimée", icon: <Text>i2</Text> },
        ]}
      />,
    );

    expect(screen.getByText("Restourne")).toBeOnTheScreen();
    expect(screen.getByText("Aimée")).toBeOnTheScreen();
    expect(screen.getByText("i2")).toBeOnTheScreen();
    expect(screen.getAllByTestId("recap-fact-divider")).toHaveLength(1);
  });
});
