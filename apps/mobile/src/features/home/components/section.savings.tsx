import type { SavingsCard as SavingsCardModel } from "../../../shared/member/model.portfolio";
import { router } from "expo-router";
import { View } from "react-native";

import { HorizontalCardList } from "../../../shared/components/macros/list.horizontal-card";
import { SavingsCard } from "../../savings";
import { formatCountLabel } from "../model/model.home-content";

/** Props de la section des cartes de pointage de l'accueil. */
export interface SavingsSectionProps {
  /** Cartes non archivées ; la section n'est rendue que si la liste en contient. */
  readonly items: readonly SavingsCardModel[];
  /** Vrai sans section des tontines : la section remonte sur le bandeau bleu. */
  readonly lead: boolean;
  /** Total des cartes non archivées, affiché dans le titre. */
  readonly count: number;
}

/**
 * Affiche le titre et la liste horizontale des cartes de pointage actives :
 * toute carte pas encore retirée, même remplie.
 * @param props Cartes à afficher, et place en tête d'accueil.
 * @returns La section des cartes de pointage.
 */
export function SavingsSection(props: SavingsSectionProps) {
  const { items: active, lead } = props;

  return (
    <View className={lead ? "-mt-[276px] mb-5 flex-col" : "mt-4 flex-col"}>
      <HorizontalCardList
        items={active}
        keyOf={(item) => item.id}
        renderItem={(item, index) => <SavingsCard item={item} index={index} />}
        title={{
          label: formatCountLabel(props.count, "Carte active", "Cartes actives"),
          tone: lead ? "light" : "dark",
          onPress: () => router.push("/savings"),
        }}
      />
    </View>
  );
}
