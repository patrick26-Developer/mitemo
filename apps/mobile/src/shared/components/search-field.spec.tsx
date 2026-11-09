import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../testing/render-with-safe-area";
import { SearchField } from "./search-field";

describe("SearchField", () => {
  it("saisit une recherche", async () => {
    const onChangeText = jest.fn();
    await renderWithSafeArea(
      <SearchField
        value=""
        onChangeText={onChangeText}
        placeholder="Rechercher une tontine"
        accessibilityLabel="Rechercher dans la liste"
        clear={{ label: "Annuler la recherche", onPress: jest.fn() }}
      />,
    );

    fireEvent.changeText(screen.getByPlaceholderText("Rechercher une tontine"), "amis");

    expect(onChangeText).toHaveBeenCalledWith("amis");
  });

  it("n'affiche la croix qu'avec du texte par défaut", async () => {
    await renderWithSafeArea(
      <SearchField
        value=""
        onChangeText={jest.fn()}
        placeholder="Rechercher"
        accessibilityLabel="Recherche globale"
        clear={{ label: "Effacer la recherche", onPress: jest.fn() }}
      />,
    );

    expect(screen.queryByRole("button", { name: "Effacer la recherche" })).not.toBeOnTheScreen();
  });

  it("garde la croix visible quand elle est demandée", async () => {
    await renderWithSafeArea(
      <SearchField
        value=""
        onChangeText={jest.fn()}
        placeholder="Rechercher"
        accessibilityLabel="Rechercher dans la liste"
        clear={{ label: "Annuler la recherche", onPress: jest.fn(), alwaysVisible: true }}
      />,
    );

    expect(screen.getByRole("button", { name: "Annuler la recherche" })).toBeOnTheScreen();
  });

  it("transmet l'effacement", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(
      <SearchField
        value="amis"
        onChangeText={jest.fn()}
        placeholder="Rechercher"
        accessibilityLabel="Recherche globale"
        clear={{ label: "Effacer la recherche", onPress }}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Effacer la recherche" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
