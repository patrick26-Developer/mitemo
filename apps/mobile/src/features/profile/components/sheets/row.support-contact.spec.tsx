import { fireEvent, render, screen } from "@testing-library/react-native";
import { Phone } from "lucide-react-native";

import { SupportContactRow } from "./row.support-contact";

describe("SupportContactRow", () => {
  it("affiche le moyen de contact et le numéro, et réagit au toucher", async () => {
    const onPress = jest.fn();
    await render(
      <SupportContactRow
        icon={Phone}
        label="Appeler"
        hint="+242 06 570 6622"
        accessibilityLabel="Appeler le service client"
        onPress={onPress}
      />,
    );

    expect(screen.getByText("Appeler")).toBeOnTheScreen();
    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Appeler le service client" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
