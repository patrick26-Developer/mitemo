import { fireEvent, screen } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PreviewAdmissionField } from "./field.preview-admission";

jest.mock("expo-secure-store", () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  setItemAsync: jest.fn(),
}));
it("enregistre le laissez-passer dans le trousseau et efface la saisie", async () => {
  jest.mocked(SecureStore.setItemAsync).mockResolvedValue(undefined);
  await renderWithSafeArea(<PreviewAdmissionField />);
  await fireEvent.press(screen.getByRole("button", { name: "Accès testeur Preview" }));
  await fireEvent.changeText(screen.getByLabelText("Laissez-passer testeur"), "signed-admission");
  await fireEvent.press(screen.getByRole("button", { name: "Enregistrer l'admission" }));
  expect(await screen.findByText("Admission enregistrée sur cet appareil.")).toBeOnTheScreen();
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
    "mitemo-preview-admission",
    "signed-admission",
    { keychainAccessible: 6 },
  );
  expect(screen.getByLabelText("Laissez-passer testeur")).toHaveDisplayValue("");
});
