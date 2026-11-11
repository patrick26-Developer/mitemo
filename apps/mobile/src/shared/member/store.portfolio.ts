import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { bigintReplacer, bigintReviver } from "./model.bigint-json";
import type { PortfolioState } from "./model.portfolio-actions";
import { createPortfolioActions } from "./model.portfolio-actions";
import { PORTFOLIO_STORAGE_KEY } from "./model.portfolio-initial";

/**
 * Portefeuille local du membre : solde disponible, tontines et cartes.
 * L'état est conservé sur l'appareil ; le modèle valide chaque opération avant
 * toute écriture, et une opération refusée ne modifie rien.
 */
export const usePortfolioStore = create<PortfolioState>()(
  persist((set, get) => createPortfolioActions({ set, get }), {
    name: PORTFOLIO_STORAGE_KEY,
    storage: createJSONStorage(() => AsyncStorage, {
      replacer: bigintReplacer,
      reviver: bigintReviver,
    }),
  }),
);
