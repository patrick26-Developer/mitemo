import { SheetRow } from "../../../../shared/components/sheet-row";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { PROFILE_LANGUAGES } from "../../model/profile-content";
import { useProfilePreferences } from "../../model/profile-preferences";

/**
 * Affiche les langues proposées et enregistre le choix du membre.
 * @returns Le contenu de la feuille « Langue ».
 */
export function LanguageSheet() {
  const language = useProfilePreferences((state) => state.language);
  const setLanguage = useProfilePreferences((state) => state.setLanguage);

  return (
    <>
      <SheetSection title="Langue de l'interface">
        {PROFILE_LANGUAGES.map((option) => (
          <SheetRow
            key={option}
            label={option}
            selected={option === language}
            onPress={() => setLanguage(option)}
          />
        ))}
      </SheetSection>
      <SheetText>
        {
          "La langue choisie s'applique aux libellés de l'application. Les messages envoyés par votre groupe restent dans leur langue d'origine."
        }
      </SheetText>
    </>
  );
}
