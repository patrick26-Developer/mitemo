import type { FeedbackKind } from "../components/atoms/banner.feedback";

/** Durée d'un toast de réussite, en millisecondes : une seconde, juste le temps de le voir. */
export const SUCCESS_TOAST_MS = 1000;

/** Durée d'un toast d'erreur, en millisecondes : le temps de lire ce qu'il faut corriger. */
const ERROR_TOAST_MS = 2500;

/**
 * Titre du toast, posé au-dessus de sa description.
 * @param kind Réussite ou erreur.
 * @param name Nom complet du membre.
 * @returns « Bravo Prénom ! » après une réussite, « Un petit souci » après une erreur.
 */
export function toastTitle(kind: FeedbackKind, name: string): string {
  if (kind === "error") return "Un petit souci";
  const firstName = name.trim().split(/\s+/)[0] ?? "";

  return firstName === "" ? "Bravo !" : `Bravo ${firstName} !`;
}

/**
 * Durée d'affichage d'un toast.
 * @param kind Réussite ou erreur.
 * @returns La durée, en millisecondes.
 */
export function toastDuration(kind: FeedbackKind): number {
  return kind === "success" ? SUCCESS_TOAST_MS : ERROR_TOAST_MS;
}
