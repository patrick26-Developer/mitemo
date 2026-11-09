import { Mail } from "lucide-react-native";
import { Text, View } from "react-native";

import { SheetSection } from "../../../../shared/components/sheet-section";
import { PALETTE } from "../../../../shared/theme/palette";
import { PROFILE_FAQ } from "../../model/profile-documents";

/**
 * Affiche les questions fréquentes et le contact du support.
 * @returns Le contenu de la feuille « Centre d'aide ».
 */
export function HelpSheet() {
  return (
    <>
      <SheetSection title="Questions fréquentes">
        {PROFILE_FAQ.map((item) => (
          <View key={item.id} className="gap-1 rounded-[14px] border border-card-border px-4 py-3">
            <Text className="text-[15px] font-semibold text-ink">{item.question}</Text>
            <Text className="text-[13px] leading-5 text-muted">{item.answer}</Text>
          </View>
        ))}
      </SheetSection>
      <SheetSection title="Nous contacter">
        <View className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3">
          <Mail size={20} color={PALETTE.muted} />
          <View className="flex-1 gap-0.5">
            <Text className="text-[15px] text-ink">support@mitemo.app</Text>
            <Text className="text-[12px] text-muted">Réponse sous 24 h ouvrées</Text>
          </View>
        </View>
      </SheetSection>
    </>
  );
}
