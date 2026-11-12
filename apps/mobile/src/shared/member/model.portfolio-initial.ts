import { INITIAL_INVITATIONS } from "../demo/demo.invitations";
import { INITIAL_CARDS } from "../demo/demo.savings";
import { INITIAL_TONTINES } from "../demo/demo.tontines";

/** Montant disponible au premier lancement, en plus petite unité de la devise. */
const INITIAL_AVAILABLE = 12_500n;

/** Données initiales du portefeuille, réutilisées par les tests. */
export const INITIAL_PORTFOLIO = {
  available: INITIAL_AVAILABLE,
  tontines: INITIAL_TONTINES,
  cards: INITIAL_CARDS,
  invitations: INITIAL_INVITATIONS,
} as const;

/** Clé de persistance du portefeuille sur l'appareil. */
export const PORTFOLIO_STORAGE_KEY = "mitemo-portfolio";
