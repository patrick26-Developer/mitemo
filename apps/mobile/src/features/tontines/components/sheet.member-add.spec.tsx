import { fireEvent, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { readDeviceContacts } from "../api/api.device-contacts";
import { MemberAddSheet } from "./sheet.member-add";

jest.mock("../api/api.device-contacts", () => ({ readDeviceContacts: jest.fn() }));

/**
 * Rend la feuille ouverte pour une tontine en préparation.
 * @param handlers Invitation et partage espionnés.
 * @param item Tontine affichée.
 * @returns Les mêmes espions, pour les assertions.
 */
async function renderSheet(
  handlers = { onAdd: jest.fn(), onShare: jest.fn() },
  item = makeTontine({ state: "PENDING", totalRounds: 5 }),
) {
  await renderWithSafeArea(
    <MemberAddSheet visible item={item} onClose={jest.fn()} {...handlers} />,
  );
  return handlers;
}

describe("MemberAddSheet", () => {
  it("sépare les contacts sur Mitemo de ceux à inviter, comme sur WhatsApp", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({
      status: "granted",
      contacts: [
        { name: "Aimée Mbemba", phone: "06 570 66 22" },
        { name: "Clarisse Ngoma", phone: "05 533 77 88" },
      ],
    });
    const { onAdd, onShare } = await renderSheet();

    expect(await screen.findByText("Sur Mitemo")).toBeOnTheScreen();
    expect(screen.getByText("Inviter sur Mitemo")).toBeOnTheScreen();
    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Ajouter Aimée Mbemba" }));
    expect(onAdd).toHaveBeenCalledWith({ name: "Aimée Mbemba", phone: "+242065706622" });

    await fireEvent.press(
      screen.getByRole("button", { name: "Inviter Clarisse Ngoma sur Mitemo" }),
    );
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("explique que le contact rejoint la tontine en acceptant l'invitation", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({ status: "granted", contacts: [] });
    await renderSheet();

    expect(await screen.findByText(/rejoint la tontine s'il l'accepte/)).toBeOnTheScreen();
  });

  it("ne propose pas un contact déjà invité", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({
      status: "granted",
      contacts: [{ name: "Aimée Mbemba", phone: "06 570 66 22" }],
    });
    const invited = makeTontine({
      state: "PENDING",
      totalRounds: 5,
      invitations: [{ id: "i1", name: "Aimée Mbemba", phone: "+242065706622" }],
    });
    await renderSheet(undefined, invited);

    expect(await screen.findByText(/Aucun de vos contacts/)).toBeOnTheScreen();
  });

  it("propose de partager le lien quand l'accès au répertoire est refusé", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({ status: "denied" });
    const { onShare } = await renderSheet();

    await fireEvent.press(
      await screen.findByRole("button", { name: "Partager le lien d'invitation" }),
    );

    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("explique l'accès refusé au répertoire", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({ status: "denied" });
    await renderSheet();

    expect(await screen.findByText(/Autorisez l'accès à vos contacts/)).toBeOnTheScreen();
  });
});
