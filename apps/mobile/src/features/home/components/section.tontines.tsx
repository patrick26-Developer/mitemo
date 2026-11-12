import type { Tontine } from "../../../shared/member/model.portfolio";
import { router } from "expo-router";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { View } from "react-native";

import { SectionTitle } from "../../../shared/components/atoms/title.section";
import { HorizontalCardList } from "../../../shared/components/macros/list.horizontal-card";
import { TontineCard } from "../../tontines";
import { formatCountLabel } from "../model/model.home-content";

/** Props de la section des tontines de l'accueil. */
export interface TontinesSectionProps {
  /** Tontines lancées ; la section n'est rendue que si la liste en contient. */
  readonly items: readonly Tontine[];
  /** Total des tontines lancées, affiché dans le titre. */
  readonly count: number;
}

/**
 * Affiche le titre et la liste horizontale des tontines actives du membre.
 * @param props Tontines à afficher.
 * @returns La section des tontines.
 */
export function TontinesSection(props: TontinesSectionProps) {
  const active = props.items;

  return (
    <View className="-mt-[276px] mb-5 flex-col gap-3">
      <SectionTitle
        label={formatCountLabel(props.count, "Tontine active", "Tontines actives")}
        tone="light"
        onPress={() => router.push("/tontines")}
      />
      <HorizontalCardList
        items={active}
        keyOf={(item) => item.id}
        renderItem={(item, index) => <TontineCard item={item} index={index} />}
        dotsColor={PALETTE.white}
      />
    </View>
  );
}
