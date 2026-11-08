import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { HatchPattern } from "@/shared/components/hatch-pattern";
import { CARD_INNER_WIDTH } from "./model/home-layout";

/** Hauteur du bandeau dégradé, en points. */
const HEADER_HEIGHT = 84;

/** Couleurs de repli du dégradé, du centre vers le bord. */
const DEFAULT_COLORS = ["#2CCA86", "#62F79D"] as const;

/** Props du bandeau dégradé. */
export interface RadialCardProps {
  readonly children?: ReactNode;
  /** Couleurs du dégradé : centre puis bord. */
  readonly colors?: readonly [string, string];
  /** Cadre du bandeau : hauteur, bordure, alignement du contenu. */
  readonly className?: string;
}

/**
 * Affiche un bandeau de carte avec dégradé radial et hachures.
 * @param props Contenu, couleurs du dégradé et cadre du bandeau.
 * @returns Le bandeau dégradé.
 */
export function RadialCard(props: RadialCardProps) {
  const { children, colors = DEFAULT_COLORS, className = "" } = props;

  return (
    <View className={className}>
      <Svg style={StyleSheet.absoluteFill} width={CARD_INNER_WIDTH} height={HEADER_HEIGHT}>
        <Defs>
          <RadialGradient id="radial" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#radial)" />
      </Svg>
      <HatchPattern width={CARD_INNER_WIDTH} height={HEADER_HEIGHT} style={styles.hatch} />
      {children}
    </View>
  );
}

/** Hachures posées sur toute la surface du bandeau dégradé. */
const styles = StyleSheet.create({
  hatch: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.8 },
});
