import { fireEvent, render, screen } from "@testing-library/react-native";
import { Bell, Lock } from "lucide-react-native";

import type { ProfileGroupContent } from "../../../shared/model/model.profile-actions";
import { ProfileGroup } from "./group.profile";

const GROUP: ProfileGroupContent = {
  title: "Préférences",
  actions: [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Politique de confidentialité", icon: Lock },
  ],
};

describe("ProfileGroup", () => {
  it("affiche le titre et une ligne par action", async () => {
    await render(<ProfileGroup group={GROUP} onSelect={jest.fn()} />);

    expect(screen.getByText("Préférences")).toBeOnTheScreen();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("transmet l'action touchée", async () => {
    const onSelect = jest.fn();
    await render(<ProfileGroup group={GROUP} onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole("button", { name: "Notifications" }));

    expect(onSelect).toHaveBeenCalledWith(GROUP.actions[0]);
  });
});
