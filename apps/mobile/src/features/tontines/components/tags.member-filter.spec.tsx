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
    await render(<MemberFilterTags options={OPTIONS} value="all" onChange={onChange} />);

    expect(screen.getByRole("button", { name: "Tous · 9" })).toBeSelected();
    await fireEvent.press(screen.getByRole("button", { name: "En attente · 3" }));

    expect(onChange).toHaveBeenCalledWith("due");
  });
});
