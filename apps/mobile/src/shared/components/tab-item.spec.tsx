import { screen } from "@testing-library/react-native";
import { UserRound } from "lucide-react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { PALETTE } from "../../shared/theme/palette";
import { TabItem } from "./tab-item";

const NOOP = () => {};

describe("TabItem", () => {
  it("remplit l'icône de l'onglet actif", async () => {
    await renderWithSafeArea(
      <TabItem
        focused
        label="Profil"
        icon={UserRound}
        onPress={NOOP}
        onLongPress={NOOP}
        testID="tab-icon"
      />,
    );

    expect(screen.getByTestId("tab-icon", { includeHiddenElements: true }).props["fill"]).toBe(
      PALETTE.tabInk,
    );
  });

  it("garde l'icône de l'onglet inactif en contour", async () => {
    await renderWithSafeArea(
      <TabItem
        focused={false}
        label="Profil"
        icon={UserRound}
        onPress={NOOP}
        onLongPress={NOOP}
        testID="tab-icon"
      />,
    );

    expect(screen.getByTestId("tab-icon", { includeHiddenElements: true }).props["fill"]).toBe(
      "none",
    );
  });
});
