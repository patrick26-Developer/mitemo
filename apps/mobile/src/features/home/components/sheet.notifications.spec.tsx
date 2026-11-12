import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { INITIAL_PORTFOLIO } from "../../../shared/member/model.portfolio-initial";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useNotificationMarksStore } from "../../../shared/notifications/store.notification-marks";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { NotificationsSheet } from "./sheet.notifications";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("NotificationsSheet", () => {
  beforeEach(() =>
    useNotificationMarksStore.setState({
      readIds: [],
      seen: { bell: [], tontines: [], savings: [] },
    }),
  );

  it("rassure le membre quand rien n'est attendu", async () => {
    usePortfolioStore.setState({ tontines: [], cards: [], invitations: [] });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText(/Vous êtes à jour/)).toBeOnTheScreen();
  });

  it("annonce la cotisation de tous les tours du membre", async () => {
    const self = { ...makeMember(SELF_MEMBER_ID, "ADMIN"), turns: 2 };
    usePortfolioStore.setState({
      tontines: [makeTontine({ name: "Tontine du marché", members: [self] })],
      cards: [],
      invitations: [],
    });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText("Cotisation à régler")).toBeOnTheScreen();
    expect(screen.getByText(/Tontine du marché : 10 000 FCFA/)).toBeOnTheScreen();
  });

  it("ouvre l'invitation au toucher, et la marque lue", async () => {
    usePortfolioStore.setState({ ...INITIAL_PORTFOLIO });
    const onClose = jest.fn();
    await renderWithSafeArea(<NotificationsSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: /Mama Nadège vous invite/ }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith("/invitation/invitation-poto-poto");
    expect(useNotificationMarksStore.getState().readIds).toContain(
      "invitation-invitation-poto-poto",
    );
  });

  it("relaie le fil des autres membres des tontines", async () => {
    usePortfolioStore.setState({ ...INITIAL_PORTFOLIO });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText("Mama Nadège a reçu son tour")).toBeOnTheScreen();
  });
});
