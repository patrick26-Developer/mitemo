import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useSavingsCreate } from "../hooks/hook.savings-create";
import { TontinePicker } from "./section.tontine-picker";

/** Props de la feuille de création d'une carte de pointage. */
export interface SavingsCreateSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Saisit les règles d'une nouvelle carte et la crée dans le portefeuille, en la
 * rattachant éventuellement à une tontine.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle carte ».
 */
export function SavingsCreateSheet(props: SavingsCreateSheetProps) {
  const { visible, onClose } = props;
  const { form, error, update, submit } = useSavingsCreate(onClose);
  const tontines = usePortfolioStore((state) => state.tontines);

  return (
    <BottomSheet visible={visible} title="Nouvelle carte" onClose={onClose}>
      <SheetTextField label="Nom" value={form.name} onChangeText={(name) => update({ name })} />
      <SheetTextField
        label="Montant d'un marqueur (FCFA)"
        value={form.markerAmount}
        onChangeText={(markerAmount) => update({ markerAmount })}
        keyboardType="number-pad"
        placeholder="5000"
      />
      <SheetTextField
        label="Nombre de marqueurs"
        value={form.markersTotal}
        onChangeText={(markersTotal) => update({ markersTotal })}
        keyboardType="number-pad"
      />
      <SheetTextField
        label="Échéance (AAAA-MM-JJ)"
        value={form.deadline}
        onChangeText={(deadline) => update({ deadline })}
        placeholder="2026-12-31"
      />
      <TontinePicker
        tontines={tontines}
        selected={form.tontineId}
        onSelect={(tontineId) => update({ tontineId })}
      />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetPrimaryButton label="Créer la carte" onPress={submit} />
    </BottomSheet>
  );
}
