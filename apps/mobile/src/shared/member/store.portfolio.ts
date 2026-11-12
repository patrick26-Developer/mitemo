import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { bigintReplacer, bigintReviver } from "./model.bigint-json";
import type { PortfolioState } from "./model.portfolio-actions";
import { createPortfolioActions } from "./model.portfolio-actions";
import { INITIAL_PORTFOLIO, PORTFOLIO_STORAGE_KEY } from "./model.portfolio-initial";

/**
 * Version du format enregistré sur l'appareil. À augmenter à chaque changement
 * de forme d'une tontine ou d'une carte : un format plus ancien est remplacé
 * par les données de départ au lieu d'être relu avec des champs manquants.
 */
export const PORTFOLIO_STORAGE_VERSION = 5;

/**
 * Remplace un portefeuille enregistré dans un format périmé par les données de
 * départ : ce sont des données de démonstration, rien n'est perdu côté serveur.
 * @returns Les données de départ du portefeuille.
 */
function migratePortfolio(): Partial<PortfolioState> {
  return { ...INITIAL_PORTFOLIO };
}

/**
 * Portefeuille local du membre : solde disponible, tontines et cartes.
 * L'état est conservé sur l'appareil ; le modèle valide chaque opération avant
 * toute écriture, et une opération refusée ne modifie rien.
 */
export const usePortfolioStore = create<PortfolioState>()(
  persist((set, get) => createPortfolioActions({ set, get }), {
    name: PORTFOLIO_STORAGE_KEY,
    version: PORTFOLIO_STORAGE_VERSION,
    migrate: migratePortfolio,
    storage: createJSONStorage(() => AsyncStorage, {
      replacer: bigintReplacer,
      reviver: bigintReviver,
    }),
  }),
);
