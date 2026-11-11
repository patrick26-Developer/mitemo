import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { SheetSection } from "./section.sheet";

describe("SheetSection", () => {
  it("affiche le titre et le contenu", async () => {
    await render(
      <SheetSection title="Moyens enregistrés">
        <Text>Airtel Money</Text>
      </SheetSection>,
    );

    expect(screen.getByText("Moyens enregistrés")).toBeOnTheScreen();
    expect(screen.getByText("Airtel Money")).toBeOnTheScreen();
  });

  it("se passe de titre", async () => {
    await render(
      <SheetSection>
        <Text>Contenu seul</Text>
      </SheetSection>,
    );

    expect(screen.getByText("Contenu seul")).toBeOnTheScreen();
  });
});
