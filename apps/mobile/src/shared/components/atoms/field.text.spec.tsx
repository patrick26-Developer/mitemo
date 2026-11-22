import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { TextField } from "./field.text";

it("permet une saisie avec un libellé accessible", async () => {
  const onChangeText = jest.fn();
  await renderWithSafeArea(<TextField label="Nom public" value="" onChangeText={onChangeText} />);
  await fireEvent.changeText(screen.getByLabelText("Nom public"), "Aimée Mbemba");
  expect(onChangeText).toHaveBeenCalledWith("Aimée Mbemba");
});
