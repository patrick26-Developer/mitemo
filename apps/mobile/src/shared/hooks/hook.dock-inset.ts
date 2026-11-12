import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

/** Marge réservée sous le contenu avant que le dock soit mesuré, en points. */
export const MIN_DOCK_INSET = 128;

/** Espace laissé entre la fin du contenu et le haut du dock, en points. */
export const DOCK_GAP = 24;

/** Marge à réserver sous le contenu et mesure du dock qui la fixe. */
export interface DockInset {
  /** Marge basse du contenu défilant, en points. */
  readonly paddingBottom: number;
  /** À poser sur le dock : mesure sa hauteur réelle. */
  readonly onDockLayout: (event: LayoutChangeEvent) => void;
}

/**
 * Réserve sous le contenu défilant la hauteur réelle du dock flottant, retour
 * d'opération et zone sûre compris : la fin du contenu n'est jamais cachée.
 * @returns La marge basse à appliquer et la mesure à poser sur le dock.
 */
export function useDockInset(): DockInset {
  const [height, setHeight] = useState(0);

  return {
    paddingBottom: Math.max(MIN_DOCK_INSET, height + DOCK_GAP),
    onDockLayout: (event) => setHeight(event.nativeEvent.layout.height),
  };
}
