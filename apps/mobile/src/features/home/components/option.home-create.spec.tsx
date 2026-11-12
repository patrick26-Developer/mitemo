import { fireEvent, render, screen } from "@testing-library/react-native";
import { Wallet } from "lucide-react-native";

import { HomeCreateOption } from "./option.home-create";

describe("HomeCreateOption", () => {
  it("annonce son nom et son explication, et réagit au toucher", async () => {
    const onPress = jest.fn();
    await render(
      <HomeCreateOption icon={Wallet} label="Une carte" detail="Épargnez." onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Une carte. Épargnez." }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
