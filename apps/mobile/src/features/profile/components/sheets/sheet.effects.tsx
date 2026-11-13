import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { SheetSwitchRow } from "../../../../shared/components/macros/row.sheet-switch";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import {
  FEEDBACK_OPTIONS,
  useFeedbackPreferences,
} from "../../../../shared/feedback/store.feedback-preferences";

/**
 * Réglage des retours de l'application : sons, confettis, vibrations et
 * animations, activés par défaut, coupables un par un.
 * @returns Le contenu de la feuille « Sons et animations ».
 */
export function EffectsSheet() {
  const preferences = useFeedbackPreferences();

  return (
    <>
      <SheetSection title="À chaque réussite">
        {FEEDBACK_OPTIONS.map((option) => (
          <SheetSwitchRow
            key={option.key}
            label={option.label}
            description={option.description}
            value={preferences[option.key]}
            onValueChange={() => preferences.toggle(option.key)}
          />
        ))}
      </SheetSection>
      <SheetText>
        Couper les animations rend l&apos;application plus sobre : les écrans s&apos;affichent sans
        mouvement.
      </SheetText>
    </>
  );
}
