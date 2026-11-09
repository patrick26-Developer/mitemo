import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";

import { BottomSheet } from "../../../shared/components/bottom-sheet";
import { SheetSection } from "../../../shared/components/sheet-section";
import { PALETTE } from "../../../shared/theme/palette";
import { HOME_NOTIFICATIONS } from "../model/home-notifications";

/** Props de la feuille des notifications. */
export interface NotificationsSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Affiche les notifications récentes du membre dans une feuille.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille des notifications.
 */
export function NotificationsSheet(props: NotificationsSheetProps) {
  const { visible, onClose } = props;

  return (
    <BottomSheet visible={visible} title="Notifications" onClose={onClose}>
      <SheetSection title="Récentes">
        {HOME_NOTIFICATIONS.map((notification) => (
          <View
            key={notification.id}
            className="gap-1 rounded-[14px] border border-card-border px-4 py-3"
          >
            <View className="flex-row items-center gap-2">
              <Bell size={16} color={PALETTE.brand} />
              <Text className="flex-1 text-[15px] font-semibold text-ink">
                {notification.title}
              </Text>
              <Text className="text-[11px] text-muted">{notification.time}</Text>
            </View>
            <Text className="text-[13px] leading-5 text-muted">{notification.message}</Text>
          </View>
        ))}
      </SheetSection>
    </BottomSheet>
  );
}
