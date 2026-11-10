import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ListActions } from "./actions.list";

describe("ListActions", () => {
  it("appelle la recherche", async () => {
    const onSearch = jest.fn();
    await renderWithSafeArea(<ListActions onSearch={onSearch} />);
    const button = screen.getByRole("button", { name: "Rechercher" });
    fireEvent.press(button);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
