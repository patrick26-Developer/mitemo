import { Text, View } from "react-native";

import { SheetText } from "../../../../shared/components/sheet-text";
import type { ProfileLegalSection } from "../../model/profile-documents";

/** Props d'un document légal. */
export interface LegalContentProps {
  readonly sections: readonly ProfileLegalSection[];
}

/**
 * Affiche les sections d'un document légal, dans l'ordre du document.
 * @param props Sections à afficher.
 * @returns Le contenu du document.
 */
export function LegalContent(props: LegalContentProps) {
  const { sections } = props;

  return (
    <>
      {sections.map((section) => (
        <View key={section.title} className="gap-1">
          <Text className="text-[15px] font-semibold text-ink">{section.title}</Text>
          <SheetText>{section.body}</SheetText>
        </View>
      ))}
    </>
  );
}
