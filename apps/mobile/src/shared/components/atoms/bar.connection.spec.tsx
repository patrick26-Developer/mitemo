import { render, screen } from "@testing-library/react-native";

import { ConnectionBar } from "./bar.connection";

describe("ConnectionBar", () => {
  it("ne s'affiche pas quand l'appareil est connecté", async () => {
    await render(<ConnectionBar status="online" />);

    expect(screen.queryByTestId("connection-bar")).not.toBeOnTheScreen();
  });

  it("annonce la coupure sur une pastille rouge", async () => {
    await render(<ConnectionBar status="offline" />);

    expect(screen.getByText("Vous n'êtes pas connecté à Internet")).toBeOnTheScreen();
    expect(screen.getByTestId("connection-bar")).toHaveStyle({ backgroundColor: "#B42318" });
  });

  it("annonce le retour du réseau sur une barre verte", async () => {
    await render(<ConnectionBar status="restored" />);

    expect(screen.getByText("Connexion rétablie")).toBeOnTheScreen();
    expect(screen.getByTestId("connection-bar")).toHaveStyle({ backgroundColor: "#1F8A4C" });
  });
});
