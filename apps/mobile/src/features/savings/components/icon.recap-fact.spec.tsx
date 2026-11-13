import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { RecapFactIcon } from "./icon.recap-fact";

describe("RecapFactIcon", () => {
  it("affiche la pastille de la nature demandée", async () => {
    await renderWithSafeArea(<RecapFactIcon kind="created" />);

    expect(screen.getByTestId("recap-fact-icon-created")).toBeOnTheScreen();
  });
});
