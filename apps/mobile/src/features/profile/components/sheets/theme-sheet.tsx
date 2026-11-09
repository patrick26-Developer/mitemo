import { SheetRow } from "../../../../shared/components/sheet-row";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { PROFILE_THEMES } from "../../model/profile-content";
import { useProfilePreferences } from "../../model/profile-preferences";

/**
 * Affiche les thèmes proposés et enregistre le choix du membre.
 * @returns Le contenu de la feuille « Thème ».
 */
export function ThemeSheet() {
  const theme = useProfilePreferences((state) => state.theme);
  const setTheme = useProfilePreferences((state) => state.setTheme);

  return (
    <>
      <SheetSection title="Apparence">
        {PROFILE_THEMES.map((option) => (
          <SheetRow
            key={option}
            label={option}
            selected={option === theme}
            onPress={() => setTheme(option)}
          />
        ))}
      </SheetSection>
      <SheetText>
        Le mode système suit le réglage clair ou sombre de votre téléphone. Le choix est conservé à
        la prochaine ouverture.
      </SheetText>
    </>
  );
}
