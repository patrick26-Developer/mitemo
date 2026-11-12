import { View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetNameField } from "../../../shared/components/macros/field.sheet-name";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { useTontineSettings } from "../hooks/hook.tontine-settings";
import { rulesLocked } from "../model/model.tontine-settings-form";
import { TontineRulesFields } from "./fields.tontine-rules";
import { TintPicker } from "./picker.tint";

/** Props de la feuille de réglages d'une tontine. */
export interface TontineSettingsSheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  readonly onClose: () => void;
}

/**
 * Réglages de l'administrateur : nom, couleur et, avant le lancement,
 * cotisation et fréquence.
 * @param props Visibilité, tontine et fermeture.
 * @returns La feuille « Modifier la tontine ».
 */
export function TontineSettingsSheet(props: TontineSettingsSheetProps) {
  const { visible, item, onClose } = props;
  const { form, change, save } = useTontineSettings(item, onClose);

  return (
    <BottomSheet
      visible={visible}
      title="Modifier la tontine"
      onClose={onClose}
      footer={
        <SheetPrimaryButton label="Enregistrer" onPress={save} accent={item.headerColors[0]} />
      }
    >
      <View className="gap-4">
        <SheetNameField
          value={form.name}
          onChangeText={(name) => change({ name })}
          hint="Le nom que verront les membres."
        />
        <TintPicker value={form.tint} onChange={(tint) => change({ tint })} />
        <TontineRulesFields form={form} locked={rulesLocked(item)} onChange={change} />
      </View>
    </BottomSheet>
  );
}
