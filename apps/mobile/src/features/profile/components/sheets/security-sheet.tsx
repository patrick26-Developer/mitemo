import { Fingerprint, ShieldCheck } from "lucide-react-native";

import { DetailCard } from "../../../../shared/components/detail-card";
import { DetailRow } from "../../../../shared/components/detail-row";
import { SheetBadge } from "../../../../shared/components/sheet-badge";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetSwitchRow } from "../../../../shared/components/sheet-switch-row";
import { SheetText } from "../../../../shared/components/sheet-text";
import { useMemberStore } from "../../../../shared/member/member-store";
import { useProfilePreferences } from "../../model/profile-preferences";

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
        <DetailCard>
          <DetailRow label="Téléphone vérifié" value={phone} />
          <DetailRow label="Code PIN" value="Modifié il y a 2 mois" />
        </DetailCard>
        <SheetSwitchRow
          icon={Fingerprint}
          label="Déverrouillage biométrique"
          description="Empreinte ou reconnaissance faciale"
          value={biometrics}
          onValueChange={setBiometrics}
        />
      </SheetSection>
      <SheetBadge icon={ShieldCheck} label="Aucune session suspecte" />
      <SheetText>
        {
          "Votre PIN n'est jamais affiché ni enregistré en clair sur l'appareil. En cas de doute, changez-le depuis l'écran de connexion."
        }
      </SheetText>
    </>
  );
}
