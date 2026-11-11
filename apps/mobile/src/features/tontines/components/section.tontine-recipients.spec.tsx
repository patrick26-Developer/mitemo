import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeMember } from "../../../shared/testing/fixtures.portfolio";
import { TontineRecipients } from "./section.tontine-recipients";

describe("TontineRecipients", () => {
  it("marque le destinataire choisi et transmet le nouveau choix", async () => {
    const onSelect = jest.fn();
    await render(
      <TontineRecipients
        members={[makeMember("m2", "MEMBRE"), makeMember("m3", "MEMBRE")]}
        selected="m2"
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole("button", { name: "Membre m2" })).toBeSelected();

    await fireEvent.press(screen.getByRole("button", { name: "Membre m3" }));

    expect(onSelect).toHaveBeenCalledWith("m3");
  });
});
