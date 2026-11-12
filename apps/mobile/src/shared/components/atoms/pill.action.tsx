import type { LucideIcon } from "lucide-react-native";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { HAIRLINE_WIDTH } from "../../theme/theme.hairline-width";
import { PALETTE } from "../../theme/theme.palette";
import { CountBadge } from "./badge.count";

/** Variantes de la pastille : posée sur des cartes ou sur le fond de l'écran. */
export const ACTION_PILL_VARIANTS = ["raised", "flat"] as const;

/** Variante d'une pastille d'actions. Voir {@link ACTION_PILL_VARIANTS}. */
export type ActionPillVariant = (typeof ACTION_PILL_VARIANTS)[number];

/** Une action de la pastille : son icône, son libellé et son effet. */
export interface ActionPillAction {
  readonly icon: LucideIcon;
  /** Libellé annoncé aux lecteurs d'écran. */
  readonly label: string;
  readonly onPress?: (() => void) | undefined;
  /** Pastille de compteur posée sur l'icône, absente quand il n'y a rien. */
  readonly badge?: string | null;
}

/** Props d'une pastille d'actions rapides. */
export interface ActionPillProps {
  readonly actions: readonly ActionPillAction[];
  /** `raised` pour flotter au-dessus des cartes, `flat` sur le fond de l'écran. */
  readonly variant?: ActionPillVariant;
}

/** Couleurs de chaque variante, appliquées au conteneur et aux séparateurs. */
const VARIANTS: Readonly<Record<ActionPillVariant, { container: string; divider: string }>> = {
  raised: { container: "border-card-border bg-white", divider: "bg-card-border" },
  flat: { container: "border-rule-border bg-tab-active", divider: "bg-white" },
};

/**
 * Affiche des actions rapides côte à côte, séparées par un filet vertical ;
 * une action peut porter une pastille de compteur.
 * @param props Actions et variante de la pastille.
 * @returns La pastille d'actions.
 */
export function ActionPill(props: ActionPillProps) {
  const { actions, variant = "flat" } = props;
  const { container, divider } = VARIANTS[variant];

  return (
    <View
      className={`flex-row items-center gap-3 rounded-[22px] px-3 py-2.5 ${container}`}
      style={variant === "raised" ? styles.raised : styles.flat}
    >
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <Fragment key={action.label}>
            {index === 0 ? null : <View className={`h-3.5 w-px ${divider}`} />}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={action.label}
              hitSlop={8}
              onPress={action.onPress}
            >
              <Icon size={20} color={PALETTE.tabInk} />
              {action.badge == null ? null : <CountBadge label={action.badge} />}
            </Pressable>
          </Fragment>
        );
      })}
    </View>
  );
}

/** Filet et ombre de la pastille, selon qu'elle flotte ou non. */
const styles = StyleSheet.create({
  raised: {
    borderWidth: HAIRLINE_WIDTH,
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  flat: {
    borderWidth: 1,
    borderCurve: "continuous",
  },
});
