import { Text } from "react-native";

import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { HorizontalCardList } from "./list.horizontal-card";

describe("HorizontalCardList", () => {
  it("affiche une carte par élément", async () => {
    await renderWithSafeArea(
      <HorizontalCardList
        items={["Tontine A", "Tontine B"]}
        keyOf={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
      />,
    );

    expect(screen.getByText("Tontine A")).toBeOnTheScreen();
    expect(screen.getByText("Tontine B")).toBeOnTheScreen();
  });
});
