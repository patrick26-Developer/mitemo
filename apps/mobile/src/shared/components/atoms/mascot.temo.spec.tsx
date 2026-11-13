import { render, screen } from "@testing-library/react-native";

import { MascotTemo } from "./mascot.temo";

describe("MascotTemo", () => {
  it("dessine Temo à la taille demandée, avec son corps", async () => {
    await render(<MascotTemo size={44} />);

    expect(screen.getByTestId("mascot-temo", { includeHiddenElements: true })).toHaveProp(
      "width",
      44,
    );
    expect(screen.getByTestId("mascot-body", { includeHiddenElements: true })).toBeOnTheScreen();
  });
});
