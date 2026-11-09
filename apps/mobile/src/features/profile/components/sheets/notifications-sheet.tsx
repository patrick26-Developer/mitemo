import { Switch, Text, View } from "react-native";

import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { PALETTE } from "../../../../shared/theme/palette";
import { NOTIFICATION_OPTIONS, useProfilePreferences } from "../../model/profile-preferences";

/** Couleurs de la piste du commutateur. */
const TRACK_COLORS = { false: PALETTE.tabActive, true: PALETTE.brand };

/**
 * Affiche les catégories de notifications et leurs commutateurs.
 * @returns Le contenu de la feuille « Notifications ».
 */
export function NotificationsSheet() {
  const notifications = useProfilePreferences((state) => state.notifications);
  const toggleNotification = useProfilePreferences((state) => state.toggleNotification);

  return (
    <>
      <SheetSection title="Me prévenir pour">
        {NOTIFICATION_OPTIONS.map((option) => (
          <View
            key={option.key}
            className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3"
          >
            <View className="flex-1 gap-0.5">
              <Text className="text-[15px] text-ink">{option.label}</Text>
              <Text className="text-[12px] text-muted">{option.description}</Text>
            </View>
            <Switch
              accessibilityLabel={option.label}
              value={notifications[option.key]}
              onValueChange={() => toggleNotification(option.key)}
              trackColor={TRACK_COLORS}
              thumbColor={PALETTE.white}
            />
          </View>
        ))}
      </SheetSection>
      <SheetText>
        Les rappels sont envoyés uniquement aux moments utiles, jamais pour relancer une cotisation
        déjà réglée.
      </SheetText>
    </>
  );
}
