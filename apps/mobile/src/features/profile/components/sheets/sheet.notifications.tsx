import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { SheetSwitchRow } from "../../../../shared/components/macros/row.sheet-switch";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { NOTIFICATION_OPTIONS, useProfilePreferences } from "../../hooks/store.profile-preferences";

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
