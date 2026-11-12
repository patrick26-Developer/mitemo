import { useEffect, useState } from "react";

/** Ce qui décide de la fin de l'écran de lancement. */
export interface SplashVisibleInput {
  /** Vrai une fois les données enregistrées sur l'appareil relues. */
  readonly ready: boolean;
  /** Durée minimale d'affichage, en millisecondes, pour que le logo ne clignote pas. */
  readonly minDuration: number;
}

/**
 * Garde l'écran de lancement tant que l'appareil n'a pas relu ses données et
 * que la durée minimale n'est pas écoulée.
 * @param input Données prêtes et durée minimale.
 * @returns `true` tant que l'écran de lancement doit rester affiché.
 */
export function useSplashVisible(input: SplashVisibleInput): boolean {
  const { ready, minDuration } = input;
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setElapsed(true), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  return !(ready && elapsed);
}
