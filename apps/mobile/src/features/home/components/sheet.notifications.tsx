import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";

import { SheetInfoCard } from "../../../shared/components/macros/card.sheet-info";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { buildNotifications } from "../model/model.home-notifications";

/** Props de la feuille des notifications. */
export interface NotificationsSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Affiche les notifications déduites des tontines et des cartes du membre.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille des notifications.
 */
export function NotificationsSheet(props: NotificationsSheetProps) {
  const { visible, onClose } = props;
  const tontines = usePortfolioStore((state) => state.tontines);
  const cards = usePortfolioStore((state) => state.cards);
  const notifications = buildNotifications(tontines, cards);

  return (
    <BottomSheet visible={visible} title="Notifications" onClose={onClose}>
      {notifications.length === 0 ? (
        <SheetText>Vous êtes à jour : aucune action n&apos;est attendue pour le moment.</SheetText>
      ) : (
        <SheetSection title="Récentes">
          {notifications.map((notification) => (
            <SheetInfoCard key={notification.id}>
              <View className="flex-row items-center gap-2">
                <Bell size={16} color={PALETTE.brand} />
                <Text className="flex-1 text-[15px] font-semibold text-ink">
                  {notification.title}
                </Text>
                <Text className="text-[11px] text-muted">{notification.time}</Text>
              </View>
              <Text className="text-[13px] leading-5 text-muted">{notification.message}</Text>
            </SheetInfoCard>
          ))}
        </SheetSection>
      )}
    </BottomSheet>
  );
}
