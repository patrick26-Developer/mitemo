import { accentColors } from "../../../shared/model/model.accent-color";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { MemberFilterTags } from "./tags.member-filter";

/** Étiquettes d'une tontine en cours. */
const OPTIONS = [
  { value: "all", label: "Tous · 9" },
  { value: "paid", label: "À jour · 6" },
  { value: "due", label: "En attente · 3" },
] as const;

describe("MemberFilterTags", () => {
  it("marque l'étiquette choisie et signale le changement", async () => {
    const onChange = jest.fn();
    await render(
      <MemberFilterTags options={OPTIONS} value="all" onChange={onChange} accent="#2CCA86" />,
    );

    expect(screen.getByRole("button", { name: "Tous · 9" })).toBeSelected();
    await fireEvent.press(screen.getByRole("button", { name: "En attente · 3" }));

    expect(onChange).toHaveBeenCalledWith("due");
  });

  it("teinte l'étiquette choisie à la couleur de la tontine", async () => {
    await render(
      <MemberFilterTags options={OPTIONS} value="all" onChange={jest.fn()} accent="#2CCA86" />,
    );

    expect(screen.getByRole("button", { name: "Tous · 9", selected: true })).toHaveStyle({
      backgroundColor: accentColors("#2CCA86").background,
    });
  });
});
