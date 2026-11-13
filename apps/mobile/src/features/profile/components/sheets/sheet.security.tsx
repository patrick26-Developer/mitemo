import { LockKeyhole, Phone } from "lucide-react-native";
import { useState } from "react";

import { SheetSecondaryButton } from "../../../../shared/components/atoms/button.sheet-secondary";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { FactList } from "../../../../shared/components/macros/list.facts";
import { useMemberStore } from "../../../../shared/member/store.member";
import { PinChange } from "../../../auth";

/**
 * Sécurité du compte : le numéro et la protection par code PIN, au style des
 * feuilles d'information, puis le changement du code en trois étapes.
 * @returns Le contenu de la feuille « Sécurité ».
 */
export function SecuritySheet() {
  const [changing, setChanging] = useState(false);

  if (changing) return <PinChange onDone={() => setChanging(false)} />;

  return <SecuritySummary onChangePin={() => setChanging(true)} />;
}

/** Props du résumé de sécurité. */
interface SecuritySummaryProps {
  readonly onChangePin: () => void;
}

/**
 * Numéro et protection du compte, avec le bouton de changement de code.
 * @param props Ouverture du changement de code.
 * @returns Le résumé de sécurité.
 */
function SecuritySummary(props: SecuritySummaryProps) {
  const phone = useMemberStore((state) => state.phone);
  const rows = [
    { id: "phone", icon: Phone, label: "Téléphone", value: phone },
    { id: "pin", icon: LockKeyhole, label: "Code PIN", value: "Demandé à chaque ouverture" },
  ];

  return (
    <>
      <FactList items={rows} />
      <SheetSecondaryButton label="Changer mon code PIN" onPress={props.onChangePin} />
      <SheetText>
        {
          "Votre code PIN n'est jamais affiché ni enregistré en clair : seule son empreinte est conservée dans le trousseau chiffré du téléphone."
        }
      </SheetText>
    </>
  );
}
