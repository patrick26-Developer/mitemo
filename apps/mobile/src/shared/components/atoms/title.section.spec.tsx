import { fireEvent, render, screen } from "@testing-library/react-native";

import { SectionTitle } from "./title.section";

describe("SectionTitle", () => {
  it("ouvre la section touchée", async () => {
    const onPress = jest.fn();
    await render(<SectionTitle label="2 Tontines" tone="light" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "2 Tontines" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("utilise le ton sombre par défaut", async () => {
    await render(<SectionTitle label="Cartes" />);

    expect(screen.getByText("Cartes")).toBeOnTheScreen();
  });
});
