import { act, renderHook } from "@testing-library/react-native";

import { usePortfolioStore } from "../member/store.portfolio";
import { makeTontine, TEST_PORTFOLIO } from "../testing/fixtures.portfolio";
import { useNotifications } from "./hook.notifications";
import { useNotificationMarksStore } from "./store.notification-marks";

describe("useNotifications", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ ...TEST_PORTFOLIO, tontines: [makeTontine()], cards: [] });
    useNotificationMarksStore.setState({
      readIds: [],
      seen: { bell: [], tontines: [], savings: [] },
    });
  });

  it("garde une notification touchée dans la liste, sans son fond « non lue »", async () => {
    const { result } = await renderHook(() => useNotifications());
    expect(result.current.items[0]?.read).toBe(false);

    await act(async () => result.current.markRead("pay-t1-1"));

    expect(result.current.items[0]?.read).toBe(true);
  });
});
