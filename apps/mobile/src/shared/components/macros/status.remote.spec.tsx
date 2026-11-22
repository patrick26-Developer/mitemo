import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { RemoteStatus } from "./status.remote";

it("permet un nouvel essai après un échec sans afficher de données", async () => {
  const reload = jest.fn();
  await renderWithSafeArea(
    <RemoteStatus resource={{ data: null, loading: false, error: "Hors ligne", reload }} />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Hors ligne");
  await fireEvent.press(screen.getByRole("button", { name: "Réessayer" }));
  expect(reload).toHaveBeenCalledTimes(1);
});
