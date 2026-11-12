import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { accentColors } from "../../model/model.accent-color";
import { PALETTE } from "../../theme/theme.palette";

/** Props de l'en-tête d'un écran de détail. */
export interface DetailHeaderProps {
  readonly title: string;
  /** Couleur d'action de l'écran, appliquée au bouton de retour et aux actions. */
  readonly accent?: string;
  /** Actions rapides posées à droite du titre, par exemple partager. */
  readonly actions?: readonly HeaderAction[];
}

/** Action rapide de l'en-tête : une icône seule, nommée pour l'accessibilité. */
export interface HeaderAction {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly onPress: () => void;
}

/** Props du bouton de retour. */
interface BackButtonProps {
  readonly accent: string | undefined;
}

/**
 * Ramène à l'écran précédent ; prend la couleur d'action de l'écran quand il
 * en a une, gris neutre sinon.
 * @param props Couleur d'action éventuelle.
 * @returns Le bouton de retour.
 */
function BackButton(props: BackButtonProps) {
  const colors = props.accent === undefined ? null : accentColors(props.accent);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Retour"
      hitSlop={8}
      onPress={() => router.back()}
      className={`h-10 w-10 items-center justify-center rounded-full ${colors === null ? "bg-tab-active" : ""}`}
      style={colors === null ? undefined : { backgroundColor: colors.background }}
    >
      <ChevronLeft size={22} color={colors?.foreground ?? PALETTE.tabInk} strokeWidth={2.2} />
    </Pressable>
  );
}

/**
 * Affiche un bouton de retour, le titre de l'écran de détail et ses actions
 * rapides à droite, sur un fond blanc qui se fond en dégradé dans le contenu
 * qui défile dessous.
 * @param props Titre de l'écran, couleur d'action et actions.
 * @returns L'en-tête de détail.
 */
export function DetailHeader(props: DetailHeaderProps) {
  const { title, accent, actions = [] } = props;

  return (
    <View className="z-10 flex-row items-center gap-3 bg-white px-4 pb-1">
      <HeaderFade />
      <BackButton accent={accent} />
      <Text
        accessibilityRole="header"
        className="flex-1 text-[22px] font-bold text-ink"
        numberOfLines={1}
      >
        {title}
      </Text>
      {actions.map((action) => (
        <HeaderActionButton key={action.label} action={action} />
      ))}
    </View>
  );
}

/** Props d'une action rapide de l'en-tête. */
interface HeaderActionButtonProps {
  readonly action: HeaderAction;
}

/**
 * Bouton rond d'une action rapide, au gris neutre de l'en-tête.
 * @param props Action à rendre.
 * @returns Le bouton de l'action.
 */
function HeaderActionButton(props: HeaderActionButtonProps) {
  const { label, icon: Icon, onPress } = props.action;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-tab-active"
    >
      <Icon size={20} color={PALETTE.tabInk} strokeWidth={2.2} />
    </Pressable>
  );
}

/** Couleurs du fondu sous l'en-tête : blanc en haut, transparent en bas. */
const FADE_COLORS = ["#FFFFFF", "rgba(255, 255, 255, 0)"] as const;

/**
 * Fondu posé sous l'en-tête : le contenu qui remonte disparaît en douceur
 * au lieu d'être coupé net.
 * @returns Le dégradé, qui laisse passer les touchers.
 */
function HeaderFade() {
  return (
    <LinearGradient
      testID="detail-header-fade"
      pointerEvents="none"
      colors={FADE_COLORS}
      style={styles.fade}
    />
  );
}

/** Position du fondu, juste sous l'en-tête, que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  fade: { position: "absolute", left: 0, right: 0, top: "100%", height: 24 },
});
