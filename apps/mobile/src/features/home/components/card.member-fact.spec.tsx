import { render, screen } from "@testing-library/react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";
import { MemberFactCard } from "./card.member-fact";

describe("MemberFactCard", () => {
  it("affiche le libellé, la valeur et l'icône grise du profil", async () => {
    await render(
      <MemberFactCard row={{ kind: "phone", label: "Téléphone", value: "+242 06 570 6622" }} />,
    );

    expect(screen.getByText("Téléphone")).toBeOnTheScreen();
    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    expect(
      screen.getByTestId("member-fact-icon-phone", { includeHiddenElements: true }),
    ).toHaveProp("stroke", PALETTE.muted);
  });
});
