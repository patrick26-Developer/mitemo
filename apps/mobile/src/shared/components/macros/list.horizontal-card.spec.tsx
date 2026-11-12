import { Text } from "react-native";

import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { CARD_GAP, CARD_WIDTH } from "../../theme/theme.card-layout";
import { PALETTE } from "../../theme/theme.palette";
import { HorizontalCardList } from "./list.horizontal-card";

/** Titre de section des tests, sur fond clair. */
const TITLE = { label: "3 Tontines actives", tone: "dark", onPress: jest.fn() } as const;

describe("HorizontalCardList", () => {
  it("pose les points à droite, sur la ligne du titre, à la couleur du titre", async () => {
    await renderWithSafeArea(
      <HorizontalCardList
        items={["A", "B", "C"]}
        keyOf={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
        title={{ ...TITLE, tone: "light" }}
      />,
    );

    const header = screen.getByTestId("horizontal-card-header");
    expect(header).toContainElement(screen.getByRole("button", { name: "3 Tontines actives" }));
    expect(header).toContainElement(screen.getByLabelText("Carte 1 sur 3"));
    expect(header).toHaveStyle({ flexDirection: "row", justifyContent: "space-between" });
    expect(screen.getByTestId("page-dot-active")).toHaveStyle({ backgroundColor: PALETTE.white });
  });

  it("affiche une carte par élément", async () => {
    await renderWithSafeArea(
      <HorizontalCardList
        items={["Tontine A", "Tontine B"]}
        keyOf={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
        title={TITLE}
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
        title={TITLE}
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
        title={TITLE}
      />,
    );

    expect(screen.queryByTestId(/^page-dot-/)).toBeNull();
  });
});
