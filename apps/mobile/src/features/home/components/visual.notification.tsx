import type { LucideIcon } from "lucide-react-native";
import { Gift, HandCoins } from "lucide-react-native";
import { View } from "react-native";

import { MemberPhoto } from "../../../shared/components/atoms/photo.member";
import type {
  NotificationIcon,
  NotificationVisual,
} from "../../../shared/notifications/model.notification";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";

/** Côté du visuel d'une notification, en points. */
const VISUAL_SIZE = 44;

/** Icône de chaque rappel de l'application. */
const ICONS: Readonly<Record<NotificationIcon, LucideIcon>> = {
  due: HandCoins,
  pot: Gift,
  card: TAB_ICONS.savings,
};

/** Props du visuel d'une notification. */
export interface NotificationVisualViewProps {
  readonly visual: NotificationVisual;
}

/**
 * Visuel d'une notification : l'initiale de la personne qui agit, ou
 * l'icône du rappel dans un rond bleu pâle.
 * @param props Visuel à rendre.
 * @returns L'avatar ou l'icône.
 */
export function NotificationVisualView(props: NotificationVisualViewProps) {
  const { visual } = props;
  if (visual.kind === "avatar") {
    return (
      <MemberPhoto
        photoUri={null}
        initial={visual.name.charAt(0).toUpperCase()}
        size={VISUAL_SIZE}
        testID="notification-avatar"
      />
    );
  }
  const Icon = ICONS[visual.icon];

  return (
    <View
      testID={`notification-icon-${visual.icon}`}
      className="items-center justify-center rounded-full bg-tab-active"
      style={{ width: VISUAL_SIZE, height: VISUAL_SIZE }}
    >
      <Icon size={20} color={PALETTE.brand} />
    </View>
  );
}
