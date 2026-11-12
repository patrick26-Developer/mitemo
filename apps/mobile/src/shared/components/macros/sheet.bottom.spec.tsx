import { render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Dimensions, Platform, Text } from "react-native";

import { useKeyboardHeight } from "../../hooks/hook.keyboard-height";
import { SHEET_MAX_HEIGHT_RATIO } from "../../model/model.sheet-layout";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { BottomSheet } from "./sheet.bottom";

jest.mock("../../hooks/hook.keyboard-height", () => ({
  useKeyboardHeight: jest.fn(),
}));

const keyboardHeightMock = jest.mocked(useKeyboardHeight);

/** Marges sûres fixes, pour les rendus successifs d'une même feuille. */
const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/**
 * Feuille des conditions, ouverte ou fermée, dans ses zones sûres.
 * @param visible Visibilité demandée.
 * @returns L'élément à rendre ou à re-rendre.
 */
function termsSheet(visible: boolean) {
  return (
    <SafeAreaProvider initialMetrics={METRICS}>
      <BottomSheet visible={visible} title="Conditions d'utilisation" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>
    </SafeAreaProvider>
  );
}

describe("BottomSheet", () => {
  const initialPlatform = Platform.OS;

  beforeEach(() => {
    keyboardHeightMock.mockReturnValue(0);
  });

  afterEach(() => {
    (Platform as { OS: string }).OS = initialPlatform;
    keyboardHeightMock.mockReset();
  });

  it("affiche le titre et le contenu quand elle est visible", async () => {
    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.getByRole("header", { name: "Mes informations" })).toBeOnTheScreen();
    expect(screen.getByText("Contenu de la feuille")).toBeOnTheScreen();
    expect(
      screen.getByTestId("grid-background", { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it("ne rend rien quand elle est fermée", async () => {
    await renderWithSafeArea(
      <BottomSheet visible={false} title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.queryByText("Contenu de la feuille")).not.toBeOnTheScreen();
  });

  it("reprend les marges de la carte d'authentification", async () => {
    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.getByTestId("bottom-sheet")).toHaveStyle({
      marginBottom: 8,
      marginHorizontal: 8,
    });
  });

  it("réserve la hauteur du clavier sans déplacer la feuille sur iOS", async () => {
    keyboardHeightMock.mockReturnValue(320);

    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.getByTestId("bottom-sheet")).toHaveStyle({
      paddingBottom: 320,
      marginBottom: 8,
    });
  });

  it("ajoute la barre système à la hauteur du clavier sur Android", async () => {
    (Platform as { OS: string }).OS = "android";
    keyboardHeightMock.mockReturnValue(320);

    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.getByTestId("bottom-sheet")).toHaveStyle({
      paddingBottom: 374,
      marginBottom: 0,
    });
  });

  it("colle la feuille à son contenu et borne seulement sa hauteur maximale", async () => {
    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    const screenHeight = Dimensions.get("window").height;

    expect(screen.getByTestId("bottom-sheet")).toHaveStyle({
      minHeight: 0,
      paddingBottom: 34,
      maxHeight: screenHeight * SHEET_MAX_HEIGHT_RATIO,
    });
  });

  it("pose le pied à la fin du contenu, qui défile avec lui", async () => {
    await renderWithSafeArea(
      <BottomSheet
        visible
        title="Nouvelle carte"
        onClose={jest.fn()}
        footer={<Text>Continuer</Text>}
      >
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    const footer = screen.getByTestId("bottom-sheet-footer");
    const scroll = screen.getByTestId("bottom-sheet-scroll");

    expect(footer).toHaveTextContent("Continuer");
    expect(scroll).toContainElement(footer);
  });

  it("rouvre la feuille aussitôt sur Android, qui n'attend aucune fin de fermeture", async () => {
    (Platform as { OS: string }).OS = "android";
    const { rerender } = await render(termsSheet(true));

    await rerender(termsSheet(false));
    await rerender(termsSheet(true));

    expect(screen.getByText("Contenu de la feuille")).toBeOnTheScreen();
  });

  it("ne pose aucun pied quand la feuille n'en a pas", async () => {
    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.queryByTestId("bottom-sheet-footer")).not.toBeOnTheScreen();
  });
});
