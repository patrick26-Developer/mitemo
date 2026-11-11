import { fireEvent, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { readDeviceContacts } from "../api/api.device-contacts";
import { MemberAddSheet } from "./sheet.member-add";

jest.mock("../api/api.device-contacts", () => ({ readDeviceContacts: jest.fn() }));

/**
 * Rend la feuille ouverte pour une tontine en préparation.
 * @param handlers Inscription et partage espionnés.
 * @returns Les mêmes espions, pour les assertions.
 */
async function renderSheet(handlers = { onAdd: jest.fn(), onShare: jest.fn() }) {
  await renderWithSafeArea(
    <MemberAddSheet
      visible
      item={makeTontine({ state: "PENDING", totalRounds: 5 })}
      onClose={jest.fn()}
      {...handlers}
    />,
  );
  return handlers;
}

describe("MemberAddSheet", () => {
  it("liste seulement les contacts du répertoire qui ont un compte Mitemo", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({
      status: "granted",
      contacts: [
        { name: "Aimée Mbemba", phone: "06 570 66 22" },
        { name: "Sans compte", phone: "04 433 22 11" },
      ],
    });
    const { onAdd } = await renderSheet();

    await fireEvent.press(await screen.findByRole("button", { name: "Ajouter Aimée Mbemba" }));

    expect(screen.queryByText("Sans compte")).toBeNull();
    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    expect(onAdd).toHaveBeenCalledWith({ name: "Aimée Mbemba", phone: "+242065706622" });
  });

  it("propose de partager le lien quand aucun contact n'a de compte", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({ status: "granted", contacts: [] });
    const { onShare } = await renderSheet();

    expect(await screen.findByText(/Aucun de vos contacts/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Partager le lien d'invitation" }));

    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("explique l'accès refusé au répertoire", async () => {
    jest.mocked(readDeviceContacts).mockResolvedValue({ status: "denied" });
    await renderSheet();

    expect(await screen.findByText(/Autorisez l'accès à vos contacts/)).toBeOnTheScreen();
  });
});
