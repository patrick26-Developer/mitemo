import { fireEvent, screen } from "@testing-library/react-native";
import { ListSearchField } from "./list-search-field";
import { renderWithSafeArea } from "../testing/render-with-safe-area";

describe("ListSearchField", () => {
  it("saisit une recherche", async () => {
    const onChangeText = jest.fn();
    await renderWithSafeArea(
      <ListSearchField
        value=""
        onChangeText={onChangeText}
        onCancel={jest.fn()}
        placeholder="Rechercher une tontine"
      />,
    );
    const input = screen.getByPlaceholderText("Rechercher une tontine");
    fireEvent.changeText(input, "amis");
    expect(onChangeText).toHaveBeenCalledWith("amis");
  });
});
