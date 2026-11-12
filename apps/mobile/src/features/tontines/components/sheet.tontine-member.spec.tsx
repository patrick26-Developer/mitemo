import { fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { useMemberStore } from "../../../shared/member/store.member";
import { firstOf, makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineMemberSheet } from "./sheet.tontine-member";

/** Membre suivi : un autre membre, à jour au tour en cours. */
const OTHER = makeMember("m2", "MEMBRE", true);

describe("TontineMemberSheet", () => {
  beforeEach(() => {
    useMemberStore.setState({ photoUri: null });
  });

  it("explique qu'une tontine pas encore lancée attend ses membres", async () => {
    const pending = makeTontine({ state: "PENDING", totalRounds: 4, members: [OTHER] });
    await renderWithSafeArea(
      <TontineMemberSheet visible item={pending} member={OTHER} onClose={jest.fn()} />,
    );

    expect(screen.getByRole("header", { name: "Tontine en attente" })).toBeOnTheScreen();
    expect(screen.getByText("La tontine attend encore 3 membres pour débuter.")).toBeOnTheScreen();
  });

  it("liste les tours passés, cochés quand le membre a cotisé", async () => {
    const active = makeTontine({ round: 3 });
    const member = firstOf(active.members.filter((entry) => entry.id !== SELF_MEMBER_ID));
    await renderWithSafeArea(
      <TontineMemberSheet visible item={active} member={member} onClose={jest.fn()} />,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(screen.getByRole("checkbox", { name: /^Tour 1, /, checked: true })).toBeOnTheScreen();
  });

  it("montre la photo du membre et l'agrandit au toucher", async () => {
    useMemberStore.setState({ photoUri: "file:///photo.jpg" });
    const self = makeMember(SELF_MEMBER_ID, "ADMIN", true);
    const active = makeTontine({ members: [self] });
    await renderWithSafeArea(
      <TontineMemberSheet visible item={active} member={self} onClose={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Agrandir la photo" }));

    expect(screen.getByRole("button", { name: "Réduire la photo" })).toBeOnTheScreen();
  });
});
