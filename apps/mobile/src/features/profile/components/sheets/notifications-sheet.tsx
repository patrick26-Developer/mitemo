import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetSwitchRow } from "../../../../shared/components/sheet-switch-row";
import { SheetText } from "../../../../shared/components/sheet-text";
import { NOTIFICATION_OPTIONS, useProfilePreferences } from "../../model/profile-preferences";

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
          <SheetSwitchRow
            key={option.key}
            label={option.label}
            description={option.description}
            value={notifications[option.key]}
            onValueChange={() => toggleNotification(option.key)}
          />
        ))}
      </SheetSection>
      <SheetText>
        Les rappels sont envoyés uniquement aux moments utiles, jamais pour relancer une cotisation
        déjà réglée.
      </SheetText>
    </>
  );
}
