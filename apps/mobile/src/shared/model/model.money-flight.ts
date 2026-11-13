/** Durée du vol de l'argent, du bouton à la somme, en millisecondes. */
export const FLIGHT_MS = 700;

/** Hauteur de l'arc au-dessus du point le plus haut du trajet, en points. */
export const FLIGHT_ARC = 140;

/** Point de l'écran, en points depuis le coin haut gauche de la fenêtre. */
export interface ScreenPoint {
  readonly x: number;
  readonly y: number;
}

/** Départ et arrivée d'un vol. */
export interface FlightPath {
  readonly from: ScreenPoint;
  readonly to: ScreenPoint;
}

/**
 * Position de l'argent en vol, sur une courbe de Bézier quadratique qui
 * monte au-dessus de la somme avant de s'y poser, comme une pièce lancée.
 * Exécutée sur le fil d'animation.
 * @param path Départ et arrivée.
 * @param t Avancement du vol, de 0 à 1.
 * @returns La position à cet instant.
 */
export function flightPoint(path: FlightPath, t: number): ScreenPoint {
  "worklet";
  const control = {
    x: (path.from.x + path.to.x) / 2,
    y: Math.min(path.from.y, path.to.y) - FLIGHT_ARC,
  };
  const u = 1 - t;

  return {
    x: u * u * path.from.x + 2 * u * t * control.x + t * t * path.to.x,
    y: u * u * path.from.y + 2 * u * t * control.y + t * t * path.to.y,
  };
}
