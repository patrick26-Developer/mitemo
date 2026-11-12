import { screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerUnavailableScreen } from "./screen.server-unavailable";

it("ne présente pas les anciens parcours locaux comme une API fonctionnelle", async () => {
  await renderWithSafeArea(<ServerUnavailableScreen />);
  expect(screen.getByText(/pas encore connecté/)).toBeOnTheScreen();
  expect(screen.queryByRole("button")).toBeNull();
});
