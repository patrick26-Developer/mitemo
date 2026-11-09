import { BadgeCheck } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { DetailRow } from "../../../../shared/components/detail-row";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { formatDate } from "../../../../shared/format/format-date";
import { useMemberStore } from "../../../../shared/member/member-store";
import { PALETTE } from "../../../../shared/theme/palette";
import { IdentityEditForm } from "./identity-edit-form";

/**
 * Affiche les informations d'identité du membre connecté et permet de les
 * compléter.
 * @returns Le contenu de la feuille « Informations personnelles ».
 */
export function IdentitySheet() {
  const [editing, setEditing] = useState(false);

  if (editing) return <IdentityEditForm onDone={() => setEditing(false)} />;

  return <IdentitySummary onEdit={() => setEditing(true)} />;
}

/** Props du résumé d'identité. */
interface IdentitySummaryProps {
  readonly onEdit: () => void;
}

/**
 * Affiche l'identité en lecture seule, avec l'action de modification.
 * @param props Ouverture du formulaire de modification.
 * @returns Le résumé d'identité.
 */
function IdentitySummary(props: IdentitySummaryProps) {
  const { onEdit } = props;
  const firstName = useMemberStore((state) => state.firstName);
  const lastName = useMemberStore((state) => state.lastName);
  const occupation = useMemberStore((state) => state.occupation);
  const phone = useMemberStore((state) => state.phone);
  const createdAt = useMemberStore((state) => state.createdAt);

  return (
    <>
      <SheetSection title="Identité">
        <View className="gap-3 rounded-[16px] border border-card-border p-4">
          <DetailRow label="Prénom" value={firstName} />
          <DetailRow label="Nom" value={lastName} />
          <DetailRow label="Profession ou formation" value={occupation} />
          <DetailRow label="Téléphone" value={phone} />
          <DetailRow label="Compte créé le" value={formatDate(createdAt)} />
        </View>
        <View className="flex-row items-center gap-2 self-start rounded-full bg-brand-veil px-3 py-1.5">
          <BadgeCheck size={16} color={PALETTE.brand} />
          <Text className="text-[13px] font-medium text-brand">Compte vérifié</Text>
        </View>
      </SheetSection>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Modifier mes informations"
        onPress={onEdit}
        className="rounded-[16px] border border-card-border py-3.5"
      >
        <Text className="text-center text-[15px] font-medium text-ink">
          Modifier mes informations
        </Text>
      </Pressable>
      <SheetText>
        {
          "Votre numéro sert à retrouver vos tontines et à sécuriser vos connexions. Il n'est jamais partagé avec les autres membres."
        }
      </SheetText>
    </>
  );
}
