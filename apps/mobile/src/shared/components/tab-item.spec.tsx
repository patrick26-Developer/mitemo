import { screen } from "@testing-library/react-native";
import { Users } from "lucide-react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { PALETTE } from "../../shared/theme/palette";
import { TabItem } from "./tab-item";

const NOOP = () => {};

describe("TabItem", () => {
  it("remplit l'icône de l'onglet actif", async () => {
    await renderWithSafeArea(
      <TabItem
        focused
        label="Tontines"
        icon={Users}
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
        label="Tontines"
        icon={Users}
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
