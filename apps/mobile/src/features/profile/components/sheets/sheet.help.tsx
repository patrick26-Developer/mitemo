import { Mail } from "lucide-react-native";
import { Text, View } from "react-native";

import { SheetInfoCard } from "../../../../shared/components/macros/card.sheet-info";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { PALETTE } from "../../../../shared/theme/theme.palette";
import { useSupportContact } from "../../../../shared/support/hook.support-contact";
import { PROFILE_FAQ } from "../../model/model.profile-documents";
import { SupportContactSection } from "../../../../shared/components/macros/section.support-contact";

/**
 * Propose de joindre le service client (WhatsApp, appel, e-mail) et
 * affiche les questions fréquentes.
 * @returns Le contenu de la feuille « Centre d'aide ».
 */
export function HelpSheet() {
  const { contact, open } = useSupportContact();

  return (
    <>
      <SupportContactSection contact={contact} onOpen={(url) => void open(url)} />
      <SheetSection title="Questions fréquentes">
        {PROFILE_FAQ.map((item) => (
          <SheetInfoCard key={item.id}>
            <Text className="text-[15px] font-semibold text-ink">{item.question}</Text>
            <Text className="text-[13px] leading-5 text-muted">{item.answer}</Text>
          </SheetInfoCard>
        ))}
      </SheetSection>
      <SheetSection title="Par e-mail">
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
