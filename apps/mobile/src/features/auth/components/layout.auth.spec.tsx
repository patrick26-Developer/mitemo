import { screen } from "@testing-library/react-native";
import { Platform, Text } from "react-native";

import { useKeyboardHeight } from "../../../shared/hooks/hook.keyboard-height";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { AuthLayout } from "./layout.auth";

jest.mock("../../../shared/hooks/hook.keyboard-height", () => ({
  useKeyboardHeight: jest.fn(),
}));

const keyboardHeightMock = jest.mocked(useKeyboardHeight);

describe("AuthLayout", () => {
  const initialPlatform = Platform.OS;

  afterEach(() => {
    (Platform as { OS: string }).OS = initialPlatform;
    keyboardHeightMock.mockReset();
  });

  it("réserve la hauteur du clavier sous le contenu sur iOS", async () => {
    keyboardHeightMock.mockReturnValue(320);

    await renderWithSafeArea(
      <AuthLayout>
        <Text>Contenu</Text>
      </AuthLayout>,
    );

    expect(screen.getByTestId("auth-sheet")).toHaveStyle({ paddingBottom: 340, marginBottom: 8 });
  });

  it("ajoute la barre système à la hauteur du clavier sur Android", async () => {
    (Platform as { OS: string }).OS = "android";
    keyboardHeightMock.mockReturnValue(320);

    await renderWithSafeArea(
      <AuthLayout>
        <Text>Contenu</Text>
      </AuthLayout>,
    );

    expect(screen.getByTestId("auth-sheet")).toHaveStyle({ paddingBottom: 374, marginBottom: 8 });
  });

  it("laisse la carte en place quand le clavier est fermé", async () => {
    keyboardHeightMock.mockReturnValue(0);

    await renderWithSafeArea(
      <AuthLayout>
        <Text>Contenu</Text>
      </AuthLayout>,
    );

    expect(screen.getByTestId("auth-sheet")).toHaveStyle({ paddingBottom: 54, marginBottom: 8 });
  });
});
