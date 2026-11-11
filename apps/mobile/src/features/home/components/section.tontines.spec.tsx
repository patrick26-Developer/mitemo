import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontinesSection } from "./section.tontines";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("TontinesSection", () => {
  it("ne compte que les tontines actives et ouvre l'onglet", async () => {
    usePortfolioStore.setState({
      tontines: [
        makeTontine({ name: "Tontine du marché" }),
        makeTontine({ id: "t2", name: "Tontine terminée", state: "COMPLETED" }),
      ],
    });
    await render(<TontinesSection />);

    expect(screen.getByText("Tontine du marché")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine terminée")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "1 Tontine" }));

    expect(router.push).toHaveBeenCalledWith("/tontines");
  });
});
