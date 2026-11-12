import { renderHook } from "@testing-library/react-native";

import { usePortfolioStore } from "../member/store.portfolio";
import { makeCard, makeTontine, TEST_PORTFOLIO } from "../testing/fixtures.portfolio";
import { useNotifications } from "./hook.notifications";
import { useSeenWhile } from "./hook.seen-while";
import { useNotificationMarksStore } from "./store.notification-marks";

/**
 * Notifications et marquage d'un endroit, comme dans l'application.
 * @param scope Endroit ouvert.
 * @returns Les pastilles après marquage.
 */
function useOpen(scope: "tontines" | null) {
  const notifications = useNotifications();
  useSeenWhile(notifications, scope);
  return notifications.counts;
}

describe("useSeenWhile", () => {
  beforeEach(() => {
    usePortfolioStore.setState({
      ...TEST_PORTFOLIO,
      tontines: [makeTontine()],
      cards: [makeCard()],
    });
    useNotificationMarksStore.setState({
      readIds: [],
      seen: { bell: [], tontines: [], savings: [] },
    });
  });

  it("vide la pastille de l'onglet ouvert, et seulement celle-là", async () => {
    const { result } = await renderHook(() => useOpen("tontines"));

    expect(result.current).toEqual({ bell: 2, tontines: 0, savings: 1 });
  });

  it("ne marque rien quand aucun endroit n'est ouvert", async () => {
    const { result } = await renderHook(() => useOpen(null));

    expect(result.current.tontines).toBe(1);
  });
});
