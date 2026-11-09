import { SheetRow } from "../../../../shared/components/sheet-row";
import { SheetSection } from "../../../../shared/components/sheet-section";
import { SheetText } from "../../../../shared/components/sheet-text";
import { PROFILE_PAYMENT_METHODS } from "../../model/profile-payments";
import { useProfilePreferences } from "../../model/profile-preferences";

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
        {PROFILE_PAYMENT_METHODS.map((method) => (
          <SheetRow
            key={method.id}
            label={method.label}
            value={method.detail}
            selected={method.id === primaryPaymentId}
            onPress={() => setPrimaryPayment(method.id)}
          />
        ))}
      </SheetSection>
      <SheetText>
        Le moyen principal est proposé par défaut au moment de régler une cotisation. Vous pouvez en
        changer à tout moment.
      </SheetText>
    </>
  );
}
