import { render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/**
 * Rend un composant dans un fournisseur de zones sûres aux marges fixes.
 * @param ui Composant à rendre.
 * @returns Le rendu de Testing Library, une fois stabilisé.
 */
export function renderWithSafeArea(ui: ReactElement) {
  return render(<SafeAreaProvider initialMetrics={INITIAL_METRICS}>{ui}</SafeAreaProvider>);
}
