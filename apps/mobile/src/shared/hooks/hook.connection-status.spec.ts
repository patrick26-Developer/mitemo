import { act, renderHook } from "@testing-library/react-native";
import { useNetworkState } from "expo-network";

import { CONNECTION_RESTORED_MS, useConnectionStatus } from "./hook.connection-status";

jest.mock("expo-network", () => ({ useNetworkState: jest.fn() }));

/**
 * Simule l'état du réseau renvoyé par expo-network.
 * @param isConnected Vrai quand l'appareil a du réseau.
 */
function setNetwork(isConnected: boolean): void {
  jest.mocked(useNetworkState).mockReturnValue({ isConnected, isInternetReachable: isConnected });
}

describe("useConnectionStatus", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("ne signale rien quand l'appareil est connecté", async () => {
    setNetwork(true);
    const { result } = await renderHook(() => useConnectionStatus());

    expect(result.current).toBe("online");
  });

  it("signale la coupure, puis le retour du réseau, avant de se taire", async () => {
    setNetwork(false);
    const { result, rerender } = await renderHook(() => useConnectionStatus());
    expect(result.current).toBe("offline");

    setNetwork(true);
    await rerender({});
    expect(result.current).toBe("restored");

    await act(() => jest.advanceTimersByTime(CONNECTION_RESTORED_MS));
    expect(result.current).toBe("online");
  });
});
