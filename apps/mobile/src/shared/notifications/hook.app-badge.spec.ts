import { renderHook } from "@testing-library/react-native";
import { setBadgeCountAsync } from "expo-notifications";

import { usePortfolioStore } from "../member/store.portfolio";
import { makeTontine, TEST_PORTFOLIO } from "../testing/fixtures.portfolio";
import { useNotificationMarksStore } from "./store.notification-marks";
import { useAppBadge } from "./hook.app-badge";

jest.mock("expo-notifications", () => ({
  setBadgeCountAsync: jest.fn(() => Promise.resolve(true)),
}));

describe("useAppBadge", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ ...TEST_PORTFOLIO, tontines: [makeTontine()], cards: [] });
    useNotificationMarksStore.setState({
      readIds: [],
      seen: { bell: [], tontines: [], savings: [] },
    });
  });

  it("pose le nombre de notifications non lues sur l'icône de l'application", async () => {
    await renderHook(() => useAppBadge(true));

    expect(setBadgeCountAsync).toHaveBeenLastCalledWith(1);
  });

  it("efface la pastille hors session", async () => {
    await renderHook(() => useAppBadge(false));

    expect(setBadgeCountAsync).toHaveBeenLastCalledWith(0);
  });
});
