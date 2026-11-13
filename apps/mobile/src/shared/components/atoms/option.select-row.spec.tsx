import { fireEvent, render, screen } from "@testing-library/react-native";

import { SelectRowOption } from "./option.select-row";

describe("SelectRowOption", () => {
  it("annonce son état choisi et transmet le toucher", async () => {
    const onSelect = jest.fn();
    await render(<SelectRowOption id="mois-1" label="Chaque mois" selected onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole("button", { name: "Chaque mois" }));

    expect(screen.getByRole("button", { name: "Chaque mois" })).toBeSelected();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
