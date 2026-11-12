import { Text, View } from "react-native";

import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import { TERMS_POINTS } from "../model/model.terms";

/** Props du rappel des conditions d'utilisation. */
export interface TermsSheetProps {
  readonly visible: boolean;
  /** Accepte les conditions : l'inscription continue. */
  readonly onAccept: () => void;
  /** Refuse les conditions : aucun compte n'est créé. */
  readonly onDecline: () => void;
}

/**
 * Rappel des conditions d'utilisation avant la création du compte, avec
 * « Refuser » et « Accepter » côte à côte.
 * @param props Visibilité, acceptation et refus.
 * @returns La feuille des conditions.
 */
export function TermsSheet(props: TermsSheetProps) {
  const { visible, onAccept, onDecline } = props;

  return (
    <BottomSheet
      visible={visible}
      title="Conditions d'utilisation"
      onClose={onDecline}
      footer={
        <SheetActionRow
          secondary={{ label: "Refuser", onPress: onDecline }}
          primary={{ label: "Accepter", onPress: onAccept }}
        />
      }
    >
      <View className="gap-3">
        {TERMS_POINTS.map((point) => (
          <View key={point} className="flex-row gap-2.5">
            <Text className="text-[14px] leading-5 text-brand">•</Text>
            <Text className="flex-1 text-[14px] leading-5 text-muted">{point}</Text>
          </View>
        ))}
      </View>
    </BottomSheet>
  );
}
