import { fireEvent, render, screen } from "@testing-library/react-native";
import { UsersRound } from "lucide-react-native";

import { ProfileRow } from "./row.profile";

describe("ProfileRow", () => {
  it("affiche le libellé, la valeur et réagit au toucher", async () => {
    const onPress = jest.fn();
    await render(
      <ProfileRow
        action={{ id: "tontines", label: "Mes tontines", icon: UsersRound, value: "3" }}
        isLast
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Mes tontines" }));

    expect(screen.getByText("3")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("n'affiche pas de valeur quand l'action n'en porte pas", async () => {
    await render(
      <ProfileRow
        action={{ id: "help", label: "Centre d'aide", icon: UsersRound }}
        isLast={false}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText("Centre d'aide")).toBeOnTheScreen();
    expect(screen.queryByText("3")).toBeNull();
  });
});
