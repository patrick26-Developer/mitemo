import { fireEvent, screen } from "@testing-library/react-native";
import { Bell, Plus, Search } from "lucide-react-native";

import { renderWithSafeArea } from "../testing/render-with-safe-area";
import { ActionPill } from "./action-pill";

describe("ActionPill", () => {
  it("affiche une action par entrée et sépare les icônes", async () => {
    await renderWithSafeArea(
      <ActionPill
        actions={[
          { icon: Search, label: "Rechercher", onPress: jest.fn() },
          { icon: Plus, label: "Ajouter", onPress: jest.fn() },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Rechercher" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeOnTheScreen();
  });

  it("déclenche l'action touchée", async () => {
    const onNotifications = jest.fn();
    await renderWithSafeArea(
      <ActionPill
        variant="raised"
        actions={[
          { icon: Search, label: "Rechercher", onPress: jest.fn() },
          { icon: Bell, label: "Notifications", onPress: onNotifications },
        ]}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Notifications" }));

    expect(onNotifications).toHaveBeenCalledTimes(1);
  });
});
