import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { Skeleton } from "./skeleton.block";

describe("Skeleton", () => {
  it("affiche un bloc de chargement aux dimensions demandées", async () => {
    await renderWithSafeArea(<Skeleton height={24} width={120} />);

    expect(screen.getByTestId("skeleton")).toHaveStyle({ height: 24, width: 120 });
  });
});
