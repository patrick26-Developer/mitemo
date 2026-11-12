import { useRef } from "react";
import type { RefObject } from "react";
import type { LayoutChangeEvent, ScrollViewInstance } from "react-native";

/** Espace laissé au-dessus de la cible une fois défilée, en points. */
const TARGET_MARGIN = 12;

/** Défilement vers une section, et mesure à poser sur elle. */
export interface ScrollToTarget {
  readonly scrollRef: RefObject<ScrollViewInstance | null>;
  readonly onTargetLayout: (event: LayoutChangeEvent) => void;
}

/**
 * Fait défiler une seule fois jusqu'à une section, dès qu'elle est mesurée :
 * une notification ouvre ainsi l'écran à l'endroit qu'elle concerne.
 * @param active Vrai quand l'écran doit s'ouvrir sur la section.
 * @returns La référence du défilement et la mesure de la section.
 */
export function useScrollToTarget(active: boolean): ScrollToTarget {
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const done = useRef(false);

  return {
    scrollRef,
    onTargetLayout: (event) => {
      if (!active || done.current) return;
      done.current = true;
      const y = Math.max(event.nativeEvent.layout.y - TARGET_MARGIN, 0);
      scrollRef.current?.scrollTo({ y, animated: true });
    },
  };
}
