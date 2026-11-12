import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontinesSection } from "./section.tontines";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("TontinesSection", () => {
  it("liste les tontines données et ouvre l'onglet", async () => {
    await render(
      <TontinesSection items={[makeTontine({ name: "Tontine du marché" })]} count={1} />,
    );

    expect(screen.getByText("Tontine du marché")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "1 Tontine active" }));

    expect(router.push).toHaveBeenCalledWith("/tontines");
  });
});
