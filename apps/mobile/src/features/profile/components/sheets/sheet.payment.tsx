import { SheetOptionList } from "../../../../shared/components/macros/list.sheet-option";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { PROFILE_PAYMENT_METHODS } from "../../model/model.profile-payments";
import { useProfilePreferences } from "../../model/model.profile-preferences";

/** Moyens de paiement, sous la forme attendue par la liste d'options. */
const PAYMENT_OPTIONS = PROFILE_PAYMENT_METHODS.map((method) => ({
  value: method.id,
  label: method.label,
  detail: method.detail,
}));

/**
 * Affiche les moyens de paiement et permet d'en choisir un principal.
 * @returns Le contenu de la feuille « Moyen de paiement ».
 */
export function PaymentSheet() {
  const primaryPaymentId = useProfilePreferences((state) => state.primaryPaymentId);
  const setPrimaryPayment = useProfilePreferences((state) => state.setPrimaryPayment);

  return (
    <>
      <SheetSection title="Moyens enregistrés">
        <SheetOptionList
          options={PAYMENT_OPTIONS}
          selected={primaryPaymentId}
          onSelect={setPrimaryPayment}
        />
      </SheetSection>
      <SheetText>
        Le moyen principal est proposé par défaut au moment de régler une cotisation. Vous pouvez en
        changer à tout moment.
      </SheetText>
    </>
  );
}
