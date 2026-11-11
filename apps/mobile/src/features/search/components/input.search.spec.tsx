import { fireEvent, render, screen } from "@testing-library/react-native";

import { SearchInput } from "./input.search";

describe("SearchInput", () => {
  it("transmet la saisie et revient en arrière", async () => {
    const onChangeText = jest.fn();
    const onBack = jest.fn();
    await render(<SearchInput value="" onChangeText={onChangeText} onBack={onBack} />);

    await fireEvent.changeText(screen.getByLabelText("Recherche globale"), "loyer");
    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(onChangeText).toHaveBeenCalledWith("loyer");
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("efface la recherche", async () => {
    const onChangeText = jest.fn();
    await render(<SearchInput value="loyer" onChangeText={onChangeText} onBack={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Effacer la recherche" }));

    expect(onChangeText).toHaveBeenCalledWith("");
  });
});
