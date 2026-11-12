import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";
import { GridBackground } from "../../../shared/components/atoms/background.grid";
import { CornerDecor } from "../../../shared/components/atoms/decor.corner";
import { BalanceCard } from "./card.balance";
import { HomeHeader } from "./header.home";

/** Hauteur du bandeau dégradé, en points. */
const HERO_HEIGHT = 700;

/** Couleurs du dégradé : bleu plein, puis fondu vers le blanc de l'écran. */
const HERO_COLORS = [PALETTE.brand, PALETTE.brand, PALETTE.white] as const;

/** Positions des couleurs dans le dégradé, de 0 à 1. */
const HERO_STOPS = [0, 0.6, 1] as const;

/** Props du bandeau haut de l'accueil. */
export interface HomeHeroProps {
  /** Marge haute de la zone sûre de l'écran, en points. */
  readonly topInset: number;
  /** Ouvre le résumé du membre depuis son avatar. */
  readonly onOpenMember: () => void;
}

/**
 * Affiche le bandeau bleu qui porte la salutation et le solde.
 * @param props Marge haute de la zone sûre et ouverture du résumé du membre.
 * @returns Le bandeau dégradé.
 */
export function HomeHero(props: HomeHeroProps) {
  const { topInset, onOpenMember } = props;

  return (
    <LinearGradient colors={HERO_COLORS} locations={HERO_STOPS} style={{ height: HERO_HEIGHT }}>
      <GridBackground />
      <CornerDecor side="left" />
      <CornerDecor side="right" />
      <View className="flex-col gap-6 pb-6" style={{ paddingTop: topInset + 12 }}>
        <HomeHeader onOpenMember={onOpenMember} />
        <BalanceCard />
      </View>
    </LinearGradient>
  );
}
