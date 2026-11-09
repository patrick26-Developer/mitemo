import { router } from "expo-router";
import {
  ChevronRight,
  Compass,
  UserRound,
  UsersRoundCollaboration,
  Wallet,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { PressableScale } from "../../../shared/components/pressable-scale";
import { PALETTE } from "../../../shared/theme/palette";
import type { SearchEntry, SearchResultKind } from "../model/search-content";

/** Icône associée à chaque type de résultat. */
const KIND_ICONS: Readonly<Record<SearchResultKind, LucideIcon>> = {
  tontine: UsersRoundCollaboration,
  savings: Wallet,
  profile: UserRound,
  page: Compass,
};

/** Props d'un résultat de recherche. */
export interface SearchResultRowProps {
  readonly entry: SearchEntry;
}

/**
 * Affiche un résultat de recherche et ouvre sa page au toucher.
 * @param props Résultat à afficher.
 * @returns La ligne de résultat.
 */
export function SearchResultRow(props: SearchResultRowProps) {
  const { entry } = props;
  const Icon = KIND_ICONS[entry.kind];

  return (
    <PressableScale
      accessibilityLabel={`Ouvrir ${entry.title}`}
      onPress={() => router.push(entry.href)}
      className="rounded-[16px] border border-card-border bg-white"
    >
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-tab-active">
          <Icon size={18} color={PALETTE.tabInk} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-[15px] font-medium text-ink" numberOfLines={1}>
            {entry.title}
          </Text>
          <Text className="text-[12px] text-muted" numberOfLines={1}>
            {entry.subtitle}
          </Text>
        </View>
        <ChevronRight size={16} color={PALETTE.muted} />
      </View>
    </PressableScale>
  );
}
