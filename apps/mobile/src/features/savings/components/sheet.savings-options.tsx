import { View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { canDeleteCard } from "../../../shared/member/model.portfolio-removal";
import { useSavingsOptions } from "../hooks/hook.savings-options";
import { CardLevelCard } from "./card.level";
import { CardEditFields } from "./fields.card-edit";
import { CardDeleteLink } from "./link.card-delete";

/** Props de la feuille d'options d'une carte. */
export interface SavingsOptionsSheetProps {
  readonly visible: boolean;
  readonly item: SavingsCard;
  readonly onClose: () => void;
}

/**
 * Options d'une carte, ouvertes par « ⋮ » : Temo explique son niveau et sa
 * couleur, puis viennent les modifications (montants seulement avant le
 * premier pointage) et, sans pointage, la suppression.
 * @param props Visibilité, carte et fermeture.
 * @returns La feuille d'options.
 */
export function SavingsOptionsSheet(props: SavingsOptionsSheetProps) {
  const { visible, item, onClose } = props;
  const { form, change, save, remove, locked } = useSavingsOptions(item, onClose);

  return (
    <BottomSheet
      visible={visible}
      title="Options de la carte"
      onClose={onClose}
      footer={<SheetPrimaryButton label="Enregistrer" onPress={save} accent={item.tint} />}
    >
      <View className="gap-5">
        <CardLevelCard item={item} />
        <CardEditFields form={form} locked={locked} onChange={change} />
        {canDeleteCard(item) ? <CardDeleteLink onConfirm={remove} /> : null}
      </View>
    </BottomSheet>
  );
}
