import { StyleSheet, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SheetPrimaryButton } from "../atoms/button.sheet-primary";
import type { SheetButtonTone } from "../atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../atoms/button.sheet-secondary";

/** Espace latéral entre les actions et le bord de l'écran, en points. */
const SIDE_PADDING = 16;

/** Espace minimal sous les actions, quand la zone sûre est nulle. */
const MIN_BOTTOM_PADDING = 10;

/** Espace au-dessus des actions, en points. */
const TOP_PADDING = 12;

/** Largeur de l'action secondaire dans le dock, en points. */
const SECONDARY_WIDTH = 112;

/** Action affichée dans le dock. */
export interface DockAction {
  readonly label: string;
  readonly onPress: () => void;
  /** Teinte de l'action principale, bleu de marque par défaut. */
  readonly tone?: SheetButtonTone;
  /** Couleur d'action propre à l'écran ; elle remplace la teinte. */
  readonly accent?: string;
}

/** Props du dock d'actions flottant d'un écran de détail. */
export interface ActionsDockProps {
  /** Action principale, absente quand aucune opération n'est possible. */
  readonly primary: DockAction | null;
  /** Action secondaire, affichée à gauche de l'action principale. */
  readonly secondary?: DockAction | null;
  /** Mesure du dock, pour que le contenu réserve sa hauteur réelle. */
  readonly onLayout?: (event: LayoutChangeEvent) => void;
}

/** Props des deux boutons du dock. */
interface DockActionsProps {
  readonly primary: DockAction | null;
  readonly secondary: DockAction | null;
}

/** Props de l'action principale du dock. */
interface DockPrimaryProps {
  readonly action: DockAction;
}

/**
 * Affiche l'action principale du dock, avec sa teinte éventuelle.
 * @param props Action principale à rendre.
 * @returns Le bouton principal du dock.
 */
function DockPrimary(props: DockPrimaryProps) {
  const { action } = props;

  return (
    <SheetPrimaryButton
      label={action.label}
      onPress={action.onPress}
      {...(action.tone === undefined ? {} : { tone: action.tone })}
      {...(action.accent === undefined ? {} : { accent: action.accent })}
    />
  );
}

/**
 * Affiche l'action secondaire : bordée par défaut, pleine à la couleur d'action
 * de l'écran quand il en a une, comme l'action principale.
 * @param props Action secondaire à rendre.
 * @returns Le bouton secondaire du dock.
 */
function DockSecondary(props: DockPrimaryProps) {
  const { action } = props;

  if (action.accent === undefined) {
    return <SheetSecondaryButton label={action.label} onPress={action.onPress} />;
  }

  return (
    <SheetPrimaryButton label={action.label} onPress={action.onPress} accent={action.accent} />
  );
}

/**
 * Dispose les actions du dock : secondaire à gauche, principale à droite, ou
 * une seule action sur toute la largeur.
 * @param props Actions à rendre.
 * @returns La ligne d'actions.
 */
function DockActions(props: DockActionsProps) {
  const { primary, secondary } = props;

  if (primary === null) {
    if (secondary === null) return null;

    return (
      <View className="flex-1">
        <DockSecondary action={secondary} />
      </View>
    );
  }

  if (secondary === null) return <DockPrimary action={primary} />;

  return (
    <View className="flex-row items-stretch gap-2.5">
      <View style={{ width: SECONDARY_WIDTH }}>
        <DockSecondary action={secondary} />
      </View>
      <View className="flex-1">
        <DockPrimary action={primary} />
      </View>
    </View>
  );
}

/**
 * Pose les actions principales d'un écran de détail en bas, au-dessus de la
 * zone sûre, sans fond ni barre : seuls les boutons flottent sur le contenu,
 * qui reste touchable entre eux. Le dock reste visible quand le contenu défile ;
 * les retours d'opération sortent en toast.
 * @param props Action principale, action secondaire et mesure.
 * @returns Le dock d'actions ; sans action, un repère vide de hauteur nulle,
 * pour que le contenu cesse de réserver la place des boutons.
 */
export function ActionsDock(props: ActionsDockProps) {
  const { primary, secondary = null, onLayout } = props;
  const insets = useSafeAreaInsets();

  if (primary === null && secondary === null) {
    return <View testID="actions-dock-empty" onLayout={onLayout} style={styles.empty} />;
  }

  return (
    <View
      testID="actions-dock"
      pointerEvents="box-none"
      onLayout={onLayout}
      className="gap-2.5"
      style={[styles.dock, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING) }]}
    >
      <DockActions primary={primary} secondary={secondary} />
    </View>
  );
}

/** Position flottante du dock, que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  dock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: TOP_PADDING,
    paddingHorizontal: SIDE_PADDING,
  },
  empty: { position: "absolute", left: 0, right: 0, bottom: 0, height: 0 },
});
