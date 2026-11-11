import { screen } from "@testing-library/react-native";
import { CircleHelp, History } from "lucide-react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ProfileActionSheet } from "./sheet.profile-action";

describe("ProfileActionSheet", () => {
  it("ouvre le contenu de l'action choisie", async () => {
    await renderWithSafeArea(
      <ProfileActionSheet
        action={{ id: "help", label: "Centre d'aide", icon: CircleHelp }}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText("Questions fréquentes")).toBeOnTheScreen();
  });

  it("reste fermée sans action", async () => {
    await renderWithSafeArea(<ProfileActionSheet action={null} onClose={jest.fn()} />);

    expect(screen.queryByText("Questions fréquentes")).toBeNull();
  });

  it("n'affiche aucun contenu pour une action qui ouvre un écran", async () => {
    await renderWithSafeArea(
      <ProfileActionSheet
        action={{ id: "history", label: "Historique", icon: History }}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText("Questions fréquentes")).toBeNull();
  });
});
