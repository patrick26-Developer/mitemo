import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

/** Marge réservée sous le contenu avant que le dock soit mesuré, en points. */
export const MIN_DOCK_INSET = 128;

/** Marge basse du contenu quand le dock n'a aucun bouton, en points. */
export const NO_DOCK_INSET = 32;

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
 * Sans bouton, le dock mesure 0 et la marge se réduit au strict minimum.
 * @returns La marge basse à appliquer et la mesure à poser sur le dock.
 */
export function useDockInset(): DockInset {
  const [height, setHeight] = useState<number | null>(null);

  return {
    paddingBottom: dockPadding(height),
    onDockLayout: (event) => setHeight(event.nativeEvent.layout.height),
  };
}

/**
 * Calcule la marge basse du contenu d'après la hauteur mesurée du dock.
 * @param height Hauteur du dock, `null` tant qu'il n'est pas mesuré.
 * @returns La marge basse, en points.
 */
function dockPadding(height: number | null): number {
  if (height === null) return MIN_DOCK_INSET;
  if (height === 0) return NO_DOCK_INSET;
  return Math.max(MIN_DOCK_INSET, height + DOCK_GAP);
}
