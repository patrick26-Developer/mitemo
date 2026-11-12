import { Text } from "react-native";

import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { CARD_GAP, CARD_WIDTH } from "../../theme/theme.card-layout";
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

  it("indique la carte affichée par des points, mis à jour au défilement", async () => {
    await renderWithSafeArea(
      <HorizontalCardList
        items={["A", "B", "C"]}
        keyOf={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
      />,
    );

    expect(screen.getByTestId("page-dot-active")).toBeOnTheScreen();
    expect(screen.getByLabelText("Carte 1 sur 3")).toBeOnTheScreen();
    await fireEvent.scroll(screen.getByTestId("horizontal-card-list"), {
      nativeEvent: { contentOffset: { x: 2 * (CARD_WIDTH + CARD_GAP), y: 0 } },
    });

    expect(screen.getByLabelText("Carte 3 sur 3")).toBeOnTheScreen();
  });

  it("n'affiche aucun point pour une seule carte", async () => {
    await renderWithSafeArea(
      <HorizontalCardList
        items={["A"]}
        keyOf={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
      />,
    );

    expect(screen.queryByTestId(/^page-dot-/)).toBeNull();
  });
});
