import { SheetOptionList } from "../../../../shared/components/macros/list.sheet-option";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { PROFILE_THEMES } from "../../model/model.profile-content";
import { useProfilePreferences } from "../../model/model.profile-preferences";

/** Thèmes proposés, sous la forme attendue par la liste d'options. */
const THEME_OPTIONS = PROFILE_THEMES.map((theme) => ({ value: theme, label: theme }));

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
        <SheetOptionList options={THEME_OPTIONS} selected={theme} onSelect={setTheme} />
      </SheetSection>
      <SheetText>
        Le mode système suit le réglage clair ou sombre de votre téléphone. Le choix est conservé à
        la prochaine ouverture.
      </SheetText>
    </>
  );
}
