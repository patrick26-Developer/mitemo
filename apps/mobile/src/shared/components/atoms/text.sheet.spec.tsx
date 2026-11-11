import { render, screen } from "@testing-library/react-native";

import { SheetText } from "./text.sheet";

describe("SheetText", () => {
  it("affiche le texte d'accompagnement", async () => {
    await render(<SheetText>Le choix est conservé.</SheetText>);

    expect(screen.getByText("Le choix est conservé.")).toBeOnTheScreen();
  });
});
