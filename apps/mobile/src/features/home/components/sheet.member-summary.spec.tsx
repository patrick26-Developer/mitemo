import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { MemberSummarySheet } from "./sheet.member-summary";

describe("MemberSummarySheet", () => {
  beforeEach(() => {
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    useMemberStore.getState().updateIdentity({
      firstName: "Espoir",
      lastName: "LOEMBA",
      occupation: "Développeur",
      phone: "+242 06 570 6622",
    });
  });

  it("liste les informations avec leur icône, séparées par un simple trait", async () => {
    await renderWithSafeArea(
      <MemberSummarySheet visible onClose={jest.fn()} onOpenProfile={jest.fn()} />,
    );

    expect(screen.getByText("Nom complet")).toBeOnTheScreen();
    expect(screen.getByText("Espoir LOEMBA")).toBeOnTheScreen();
    expect(screen.getByText("Téléphone")).toBeOnTheScreen();
    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    expect(screen.getByText("Développeur")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^fact-row-/)).toHaveLength(4);
    expect(screen.getAllByTestId("fact-divider")).toHaveLength(3);
    expect(
      screen.getByTestId("fact-icon-phone", { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it("mène à la page profil par une carte fléchée", async () => {
    const onOpenProfile = jest.fn();
    await renderWithSafeArea(
      <MemberSummarySheet visible onClose={jest.fn()} onOpenProfile={onOpenProfile} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Voir mon profil" }));

    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });
});
