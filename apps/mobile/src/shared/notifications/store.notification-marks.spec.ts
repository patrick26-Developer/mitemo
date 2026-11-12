import { useNotificationMarksStore } from "./store.notification-marks";

describe("useNotificationMarksStore", () => {
  beforeEach(() =>
    useNotificationMarksStore.setState({
      readIds: [],
      seen: { bell: [], tontines: [], savings: [] },
    }),
  );

  it("marque une notification lue une seule fois", () => {
    useNotificationMarksStore.getState().markRead("pay-1-4");
    useNotificationMarksStore.getState().markRead("pay-1-4");

    expect(useNotificationMarksStore.getState().readIds).toEqual(["pay-1-4"]);
  });

  it("marque des notifications vues à un seul endroit, sans rien changer quand tout l'est déjà", () => {
    const { markSeen } = useNotificationMarksStore.getState();
    markSeen("tontines", ["a", "b"]);
    const before = useNotificationMarksStore.getState();
    markSeen("tontines", ["a"]);

    expect(useNotificationMarksStore.getState()).toBe(before);
    expect(before.seen).toEqual({ bell: [], tontines: ["a", "b"], savings: [] });
  });
});
