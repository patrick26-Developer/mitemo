import { Fingerprint, ShieldCheck } from "lucide-react-native";

import { DetailCard } from "../../../../shared/components/macros/card.detail";
import { DetailRow } from "../../../../shared/components/atoms/row.detail";
import { SheetBadge } from "../../../../shared/components/atoms/badge.sheet";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { SheetSwitchRow } from "../../../../shared/components/macros/row.sheet-switch";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { useMemberStore } from "../../../../shared/member/store.member";
import { useProfilePreferences } from "../../model/model.profile-preferences";

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
