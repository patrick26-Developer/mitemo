import { useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import type { ReactElement } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { CARD_GAP, CARD_WIDTH } from "../../theme/theme.card-layout";
import { PageDots } from "../atoms/indicator.page";
import type { SectionTitleProps } from "../atoms/title.section";
import { SectionTitle, sectionTitleColor } from "../atoms/title.section";

/** Pas du défilement : une carte et l'espace qui la suit. */
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

/** Props de la liste horizontale de cartes. */
export interface HorizontalCardListProps<Item> {
  readonly items: readonly Item[];
  readonly keyOf: (item: Item) => string;
  readonly renderItem: (item: Item, index: number) => ReactElement;
  /** Titre de la section, posé sur la ligne des points de page. */
  readonly title: SectionTitleProps;
}

/**
 * Rang de la carte affichée, d'après le décalage du défilement.
 * @param event Événement de défilement.
 * @param count Nombre de cartes.
 * @returns Le rang, borné à la liste.
 */
function pageOf(event: NativeSyntheticEvent<NativeScrollEvent>, count: number): number {
  const page = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
  return Math.min(Math.max(page, 0), Math.max(count - 1, 0));
}

/**
 * Liste horizontale de cartes qui s'arrête sur chaque carte, avec des points
 * qui indiquent la carte affichée.
 * @param props Éléments, clé et rendu d'une carte.
 * @returns La liste et son indicateur.
 */
export function HorizontalCardList<Item>(props: HorizontalCardListProps<Item>) {
  const { items, keyOf, renderItem, title } = props;
  const [active, setActive] = useState(0);

  return (
    <View className="gap-3">
      <View testID="horizontal-card-header" style={styles.header}>
        <SectionTitle {...title} />
        <PageDots
          count={items.length}
          active={active}
          color={sectionTitleColor(title.tone ?? "dark")}
        />
      </View>
      <FlatList
        testID="horizontal-card-list"
        data={items}
        keyExtractor={keyOf}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        scrollEventThrottle={32}
        onScroll={(event) => setActive(pageOf(event, items.length))}
        contentContainerClassName="gap-3 px-4"
        renderItem={({ item, index }) => renderItem(item, index)}
      />
    </View>
  );
}

/** Ligne du titre : le titre à gauche, les points de page à droite. */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
});
