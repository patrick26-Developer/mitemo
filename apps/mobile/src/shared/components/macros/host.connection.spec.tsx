import { screen } from "@testing-library/react-native";
import { useNetworkState } from "expo-network";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ConnectionHost } from "./host.connection";

jest.mock("expo-network", () => ({ useNetworkState: jest.fn() }));

describe("ConnectionHost", () => {
  it("affiche en rouge, en haut de l'écran, la coupure du réseau, sans bloquer les touchers", async () => {
    jest
      .mocked(useNetworkState)
      .mockReturnValue({ isConnected: false, isInternetReachable: false });
    await renderWithSafeArea(<ConnectionHost />);

    expect(screen.getByText("Vous n'êtes pas connecté à Internet")).toBeOnTheScreen();
    expect(screen.getByTestId("connection-bar")).toHaveStyle({ backgroundColor: "#B42318" });
    expect(screen.getByTestId("connection-host")).toHaveStyle({ position: "absolute", top: 55 });
    expect(screen.getByTestId("connection-host")).toHaveProp("pointerEvents", "none");
  });

  it("ne montre rien tant que le réseau est là", async () => {
    jest.mocked(useNetworkState).mockReturnValue({ isConnected: true, isInternetReachable: true });
    await renderWithSafeArea(<ConnectionHost />);

    expect(screen.queryByTestId("connection-host")).toBeNull();
  });
});
