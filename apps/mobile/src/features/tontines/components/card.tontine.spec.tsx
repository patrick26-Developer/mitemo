import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontineCard } from "./card.tontine";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("TontineCard", () => {
  it("résume la tontine", async () => {
    await render(<TontineCard item={makeTontine({ name: "Tontine du marché" })} index={0} />);

    expect(screen.getByText("Tontine du marché")).toBeOnTheScreen();
    expect(screen.getByText("3 membres")).toBeOnTheScreen();
    expect(screen.getByText("5 000 FCFA chaque semaine")).toBeOnTheScreen();
    expect(screen.getByText("Tour 1 / 3")).toBeOnTheScreen();
    expect(screen.getByText("Membre m2")).toBeOnTheScreen();
  });

  it("ouvre le détail de la tontine", async () => {
    await render(
      <TontineCard item={makeTontine({ id: "t9", name: "Tontine famille" })} index={1} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir Tontine famille" }));

    expect(router.push).toHaveBeenCalledWith("/tontine/t9");
  });
});
