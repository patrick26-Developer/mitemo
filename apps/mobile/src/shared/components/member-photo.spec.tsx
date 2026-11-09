import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../testing/render-with-safe-area";
import { MemberPhoto } from "./member-photo";

describe("MemberPhoto", () => {
  it("affiche l'initiale tant qu'aucune photo n'est choisie", async () => {
    await renderWithSafeArea(<MemberPhoto photoUri={null} initial="P" size={48} testID="photo" />);

    expect(screen.getByText("P")).toBeOnTheScreen();
    expect(screen.queryByTestId("photo")).not.toBeOnTheScreen();
  });

  it("affiche la photo partagée", async () => {
    await renderWithSafeArea(
      <MemberPhoto photoUri="file:///avatar.jpg" initial="P" size={64} testID="photo" />,
    );

    expect(screen.getByTestId("photo")).toBeOnTheScreen();
    expect(screen.queryByText("P")).not.toBeOnTheScreen();
  });
});
