import { fireEvent, screen } from "@testing-library/react-native";
import type { BottomTabBarProps } from "expo-router/js-tabs";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { AnimatedTabBar } from "./animated-tab-bar";

/** Routes du navigateur, dans l'ordre trié par Expo Router (nom le plus court d'abord). */
const ROUTES = [
  { key: "index-key", name: "index" },
  { key: "profile-key", name: "profile" },
  { key: "savings-key", name: "savings" },
  { key: "tontines-key", name: "tontines" },
];

/**
 * Construit des props minimales de barre d'onglets.
 * @param index Rang de l'onglet actif dans l'état du navigateur.
 * @returns Props de test et fonctions espionnes.
 */
function buildProps(index: number) {
  const navigateToTab = jest.fn();
  const emit = jest.fn(() => ({ defaultPrevented: false }));
  const props = {
    state: { index, routes: ROUTES },
    descriptors: {},
    emitter: { emit },
    navigateToTab,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  } as unknown as BottomTabBarProps;
  return { props, navigateToTab, emit };
}

describe("AnimatedTabBar", () => {
  it("affiche les quatre onglets dans l'ordre voulu, quel que soit l'ordre des routes", async () => {
    const { props } = buildProps(0);
    await renderWithSafeArea(<AnimatedTabBar {...props} />);

    expect(screen.getAllByRole("tab").map((tab) => tab.props["accessibilityLabel"])).toEqual([
      "Accueil",
      "Tontines",
      "Cartes",
      "Profil",
    ]);
  });

  it("marque l'onglet actif comme sélectionné", async () => {
    const { props } = buildProps(1);
    await renderWithSafeArea(<AnimatedTabBar {...props} />);

    expect(screen.getByRole("tab", { name: "Profil" })).toBeSelected();
    expect(screen.getByRole("tab", { name: "Accueil" })).not.toBeSelected();
  });

  it("navigue vers l'onglet pressé", async () => {
    const { props, navigateToTab } = buildProps(0);
    await renderWithSafeArea(<AnimatedTabBar {...props} />);

    fireEvent.press(screen.getByRole("tab", { name: "Cartes" }));

    expect(navigateToTab).toHaveBeenCalledWith("savings-key");
  });

  it("ne renavigue pas vers l'onglet déjà actif", async () => {
    const { props, navigateToTab } = buildProps(0);
    await renderWithSafeArea(<AnimatedTabBar {...props} />);

    fireEvent.press(screen.getByRole("tab", { name: "Accueil" }));

    expect(navigateToTab).not.toHaveBeenCalled();
  });
});
