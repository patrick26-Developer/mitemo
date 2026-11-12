import { fireEvent, screen } from "@testing-library/react-native";
import { Share, UserPlus } from "lucide-react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { DetailHeader } from "./header.detail";

describe("DetailHeader", () => {
  it("affiche le titre et un bouton de retour", async () => {
    await renderWithSafeArea(<DetailHeader title="Loyer de Janvier" />);

    expect(screen.getByRole("header", { name: "Loyer de Janvier" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retour" })).toBeOnTheScreen();
  });

  it("donne au bouton de retour la couleur d'action de l'écran", async () => {
    await renderWithSafeArea(<DetailHeader title="Loyer" accent="#CFD8FF" />);

    expect(screen.getByRole("button", { name: "Retour" })).toHaveStyle({
      backgroundColor: "#2044DF",
    });
  });

  it("pose les actions de l'écran à droite du titre", async () => {
    const onShare = jest.fn();
    await renderWithSafeArea(
      <DetailHeader
        title="Les Amis"
        actions={[
          { label: "Partager l'invitation", icon: Share, onPress: onShare },
          { label: "Ajouter un membre", icon: UserPlus, onPress: jest.fn() },
        ]}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Partager l'invitation" }));

    expect(onShare).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Ajouter un membre" })).toBeOnTheScreen();
  });
});
