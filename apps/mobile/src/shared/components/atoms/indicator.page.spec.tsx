import { render, screen } from "@testing-library/react-native";

import { PageDots } from "./indicator.page";

describe("PageDots", () => {
  it("dessine un point par carte et met en avant la carte affichée", async () => {
    await render(<PageDots count={4} active={2} color="#083EDF" />);

    expect(screen.getAllByTestId(/^page-dot-/)).toHaveLength(4);
    expect(screen.getByLabelText("Carte 3 sur 4")).toBeOnTheScreen();
  });

  it("ne dessine rien pour une seule carte", async () => {
    await render(<PageDots count={1} active={0} color="#083EDF" />);

    expect(screen.queryByTestId(/^page-dot-/)).toBeNull();
  });
});
