import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_PORTFOLIO } from "../../../shared/member/model.portfolio-initial";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { NotificationsSheet } from "./sheet.notifications";

describe("NotificationsSheet", () => {
  it("rassure le membre quand rien n'est attendu", async () => {
    usePortfolioStore.setState({ tontines: [], cards: [], invitations: [] });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText(/Vous êtes à jour/)).toBeOnTheScreen();
  });

  it("liste les actions attendues", async () => {
    usePortfolioStore.setState({
      tontines: [makeTontine({ name: "Tontine du marché" })],
      cards: [],
      invitations: [],
    });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText("Cotisation à régler")).toBeOnTheScreen();
    expect(screen.getByText(/Tontine du marché : 5 000 FCFA/)).toBeOnTheScreen();
  });

  it("montre les invitations reçues et rejoint la tontine avec les tours choisis", async () => {
    usePortfolioStore.setState({ ...INITIAL_PORTFOLIO });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText("Commerçantes de Poto-Poto")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Accepter" }));
    expect(screen.getByRole("header", { name: "Choisir mes tours" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Augmenter Nombre de tours" }));
    await fireEvent.press(screen.getByRole("button", { name: "Rejoindre" }));

    const [joined] = usePortfolioStore.getState().tontines;
    expect(joined?.name).toBe("Commerçantes de Poto-Poto");
    expect(joined?.members.find((member) => member.id === SELF_MEMBER_ID)?.turns).toBe(2);
    expect(screen.getByRole("header", { name: "Notifications" })).toBeOnTheScreen();
  });

  it("refuse une invitation depuis les notifications", async () => {
    usePortfolioStore.setState({ ...INITIAL_PORTFOLIO });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Refuser" }));

    expect(usePortfolioStore.getState().invitations).toEqual([]);
    expect(screen.queryByText("Commerçantes de Poto-Poto")).toBeNull();
  });

  it("annonce la cotisation de tous les tours du membre", async () => {
    usePortfolioStore.setState({
      tontines: [
        makeTontine({
          name: "Tontine du marché",
          members: [
            {
              id: SELF_MEMBER_ID,
              name: "Moi",
              role: "MEMBRE",
              paidCurrentRound: false,
              turns: 2,
            },
          ],
        }),
      ],
      cards: [],
      invitations: [],
    });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText(/Tontine du marché : 10 000 FCFA/)).toBeOnTheScreen();
  });
});
