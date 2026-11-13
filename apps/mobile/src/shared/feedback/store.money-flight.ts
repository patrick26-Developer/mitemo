import { create } from "zustand";

import type { ScreenPoint } from "../model/model.money-flight";

/** Argent en vol, du bouton de paiement vers la somme. */
export interface MoneyFlight {
  readonly id: number;
  /** Montant payé, frais compris, en plus petite unité de la devise. */
  readonly amount: bigint;
}

/** Mesure de la cible, rendue au centre de la somme affichée. */
export type MeasureTarget = (done: (center: ScreenPoint) => void) => void;

/** État du vol de l'argent. */
export interface MoneyFlightState {
  readonly flight: MoneyFlight | null;
  /** Nombre d'arrivées, pour faire rebondir la somme à chacune. */
  readonly landings: number;
  /** Somme visible à l'écran, `null` quand aucune n'est affichée. */
  readonly measureTarget: MeasureTarget | null;
  /** Lance l'argent payé vers la somme. */
  launch: (amount: bigint) => void;
  /** Pose l'argent sur la somme. */
  land: () => void;
  /** Déclare, ou oublie avec `null`, la somme où l'argent arrive. */
  registerTarget: (measure: MeasureTarget | null) => void;
}

/**
 * Vol de l'argent après un paiement : il part du bouton « Cotiser » ou
 * « Pointer » et va s'ajouter à la somme affichée.
 */
export const useMoneyFlightStore = create<MoneyFlightState>()((set, get) => ({
  flight: null,
  landings: 0,
  measureTarget: null,
  launch: (amount) => set({ flight: { id: (get().flight?.id ?? get().landings) + 1, amount } }),
  land: () => set({ flight: null, landings: get().landings + 1 }),
  registerTarget: (measureTarget) => set({ measureTarget }),
}));
