import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ProfileFooter } from "./footer.profile";

describe("ProfileFooter", () => {
  it("affiche le nom de l'application", async () => {
    await renderWithSafeArea(<ProfileFooter />);

    expect(screen.getByText("Mitemo")).toBeOnTheScreen();
  });

  it("affiche la version de l'application", async () => {
    await renderWithSafeArea(<ProfileFooter />);

    expect(screen.getByText("version 0.0.0")).toBeOnTheScreen();
  });
});
