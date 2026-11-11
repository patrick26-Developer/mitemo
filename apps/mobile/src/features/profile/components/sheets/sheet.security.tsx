import { DetailCard } from "../../../../shared/components/macros/card.detail";
import { DetailRow } from "../../../../shared/components/atoms/row.detail";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { useMemberStore } from "../../../../shared/member/store.member";

/**
 * Affiche la protection réelle du compte : numéro et conservation du code PIN.
 * @returns Le contenu de la feuille « Sécurité ».
 */
export function SecuritySheet() {
  const phone = useMemberStore((state) => state.phone);

  return (
    <>
      <SheetSection title="Protection du compte">
        <DetailCard>
          <DetailRow label="Téléphone" value={phone} />
          <DetailRow label="Code PIN" value="Demandé à chaque ouverture" />
        </DetailCard>
      </SheetSection>
      <SheetText>
        {
          "Votre code PIN n'est jamais affiché ni enregistré en clair : seule son empreinte est conservée dans le trousseau chiffré du téléphone."
        }
      </SheetText>
    </>
  );
}
