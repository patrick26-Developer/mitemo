import { BadgeCheck } from "lucide-react-native";
import { Text, View } from "react-native";

import { DetailRow } from "../../../../shared/components/detail-row";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { formatDate } from "../../../../shared/format/format-date";
import { useMemberStore } from "../../../../shared/member/member-store";
import { PALETTE } from "../../../../shared/theme/palette";

/**
 * Affiche les informations d'identité du membre connecté.
 * @returns Le contenu de la feuille « Mes informations ».
 */
export function IdentitySheet() {
  const name = useMemberStore((state) => state.name);
  const phone = useMemberStore((state) => state.phone);
  const createdAt = useMemberStore((state) => state.createdAt);

  return (
    <>
      <SheetSection title="Identité">
        <View className="gap-3 rounded-[16px] border border-card-border p-4">
          <DetailRow label="Nom complet" value={name} />
          <DetailRow label="Téléphone" value={phone} />
          <DetailRow label="Compte créé le" value={formatDate(createdAt)} />
        </View>
        <View className="flex-row items-center gap-2 self-start rounded-full bg-brand-veil px-3 py-1.5">
          <BadgeCheck size={16} color={PALETTE.brand} />
          <Text className="text-[13px] font-medium text-brand">Compte vérifié</Text>
        </View>
      </SheetSection>
      <SheetText>
        {
          "Votre numéro sert à retrouver vos tontines et à sécuriser vos connexions. Il n'est jamais partagé avec les autres membres."
        }
      </SheetText>
    </>
  );
}
