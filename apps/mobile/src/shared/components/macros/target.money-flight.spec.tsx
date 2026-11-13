import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { useMoneyFlightStore } from "../../feedback/store.money-flight";
import { MoneyFlightTarget } from "./target.money-flight";

describe("MoneyFlightTarget", () => {
  beforeEach(() =>
    useMoneyFlightStore.setState({ flight: null, landings: 0, measureTarget: null }),
  );

  it("se déclare comme arrivée des vols, puis s'efface en quittant l'écran", async () => {
    const { unmount } = await render(
      <MoneyFlightTarget>
        <Text>20 000 FCFA</Text>
      </MoneyFlightTarget>,
    );

    expect(screen.getByText("20 000 FCFA")).toBeOnTheScreen();
    expect(useMoneyFlightStore.getState().measureTarget).not.toBeNull();

    await act(() => unmount());
    expect(useMoneyFlightStore.getState().measureTarget).toBeNull();
  });
});
