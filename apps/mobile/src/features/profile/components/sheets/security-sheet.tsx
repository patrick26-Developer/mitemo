import { Fingerprint, ShieldCheck } from "lucide-react-native";
import { Switch, Text, View } from "react-native";

import { DetailRow } from "../../../../shared/components/detail-row";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { useMemberStore } from "../../../../shared/member/member-store";
import { PALETTE } from "../../../../shared/theme/palette";
import { useProfilePreferences } from "../../model/profile-preferences";

/** Couleurs de la piste du commutateur biométrique. */
const TRACK_COLORS = { false: PALETTE.tabActive, true: PALETTE.brand };

/**
 * Affiche l'état de sécurité du compte et le déverrouillage biométrique.
 * @returns Le contenu de la feuille « Sécurité ».
 */
export function SecuritySheet() {
  const phone = useMemberStore((state) => state.phone);
  const biometrics = useProfilePreferences((state) => state.biometrics);
  const setBiometrics = useProfilePreferences((state) => state.setBiometrics);

  return (
    <>
      <SheetSection title="Protection du compte">
        <View className="gap-3 rounded-[16px] border border-card-border p-4">
          <DetailRow label="Téléphone vérifié" value={phone} />
          <DetailRow label="Code PIN" value="Modifié il y a 2 mois" />
        </View>
        <View className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3">
          <Fingerprint size={20} color={PALETTE.muted} />
          <View className="flex-1 gap-0.5">
            <Text className="text-[15px] text-ink">Déverrouillage biométrique</Text>
            <Text className="text-[12px] text-muted">Empreinte ou reconnaissance faciale</Text>
          </View>
          <Switch
            accessibilityLabel="Déverrouillage biométrique"
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={TRACK_COLORS}
            thumbColor={PALETTE.white}
          />
        </View>
      </SheetSection>
      <View className="flex-row items-center gap-2 self-start rounded-full bg-brand-veil px-3 py-1.5">
        <ShieldCheck size={16} color={PALETTE.brand} />
        <Text className="text-[13px] font-medium text-brand">Aucune session suspecte</Text>
      </View>
      <SheetText>
        {
          "Votre PIN n'est jamais affiché ni enregistré en clair sur l'appareil. En cas de doute, changez-le depuis l'écran de connexion."
        }
      </SheetText>
    </>
  );
}
