import { renderHook, waitFor } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeCard, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { allowReminders, presentReminder } from "../api/notifier.card-reminder";
import { useCardReminders } from "./hook.card-reminders";
import { useCardReminderStore } from "./store.card-reminders";

jest.mock("../api/notifier.card-reminder", () => ({
  allowReminders: jest.fn(),
  presentReminder: jest.fn(),
}));

const allow = jest.mocked(allowReminders);
const present = jest.mocked(presentReminder);

/** Portefeuille avec une carte liée à une tontine dont la cotisation est due. */
function seedDueLinkedCard(): void {
  usePortfolioStore.setState({
    tontines: [makeTontine({ id: "t1", round: 2 })],
    cards: [makeCard({ id: "c1", tontineId: "t1" })],
  });
}

describe("useCardReminders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCardReminderStore.setState({ sentIds: [] });
    allow.mockResolvedValue(true);
    present.mockResolvedValue();
  });

  it("notifie le versement dû depuis une carte liée, une seule fois", async () => {
    seedDueLinkedCard();

    const { rerender } = await renderHook(() => useCardReminders());
    await waitFor(() => expect(present).toHaveBeenCalledTimes(1));
    await rerender({});

    expect(present.mock.calls[0]?.[0].id).toBe("card-c1-t1-round-2");
    expect(useCardReminderStore.getState().sentIds).toEqual(["card-c1-t1-round-2"]);
    expect(present).toHaveBeenCalledTimes(1);
  });

  it("n'envoie rien quand le membre refuse les notifications", async () => {
    allow.mockResolvedValue(false);
    seedDueLinkedCard();

    await renderHook(() => useCardReminders());
    await waitFor(() => expect(allow).toHaveBeenCalled());

    expect(present).not.toHaveBeenCalled();
    expect(useCardReminderStore.getState().sentIds).toEqual([]);
  });

  it("ne demande rien quand aucun versement n'est dû", async () => {
    usePortfolioStore.setState({ tontines: [], cards: [makeCard({ tontineId: null })] });

    await renderHook(() => useCardReminders());

    expect(allow).not.toHaveBeenCalled();
  });
});
