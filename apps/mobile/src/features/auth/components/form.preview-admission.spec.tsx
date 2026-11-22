import { fireEvent, screen } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PreviewAdmissionForm } from "./form.preview-admission";

jest.mock("expo-secure-store", () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  setItemAsync: jest.fn(),
}));
it("signale un trousseau indisponible sans annoncer d'admission enregistrée", async () => {
  jest.mocked(SecureStore.setItemAsync).mockRejectedValue(new Error("locked"));
  await renderWithSafeArea(<PreviewAdmissionForm />);
  await fireEvent.changeText(screen.getByLabelText("Laissez-passer testeur"), "signed-admission");
  await fireEvent.press(screen.getByRole("button", { name: "Enregistrer l'admission" }));
  expect(await screen.findByText("Admission non enregistrée. Réessayez.")).toBeOnTheScreen();
});
