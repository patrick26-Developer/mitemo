import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetNameField } from "../../../shared/components/macros/field.sheet-name";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { canDeleteTontine } from "../../../shared/member/model.portfolio-removal";
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
  const { form, change, save, remove } = useTontineSettings(item, onClose);

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
        {canDeleteTontine(item) ? <TontineDeletion onConfirm={remove} /> : null}
      </View>
    </BottomSheet>
  );
}

/** Confirmation de la suppression d'une tontine. */
const CONFIRM_DELETE: ConfirmSheetContent = {
  title: "Supprimer la tontine ?",
  message:
    "Les membres verront que vous l'avez supprimée et ne pourront plus y cotiser. Personne n'a encore cotisé : aucun argent n'est en jeu.",
  confirmLabel: "Supprimer",
  tone: "danger",
};

/** Props de la suppression d'une tontine. */
interface TontineDeletionProps {
  readonly onConfirm: () => void;
}

/**
 * Lien rouge « Supprimer la tontine », sous les réglages, qui demande
 * confirmation dans une feuille par-dessus. Proposé seulement tant que la
 * tontine n'est pas lancée et n'a reçu aucune cotisation.
 * @param props Suppression confirmée.
 * @returns Le lien et sa confirmation.
 */
function TontineDeletion(props: TontineDeletionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Supprimer la tontine"
        onPress={() => setOpen(true)}
        className="min-h-11 items-center justify-center"
      >
        <Text className="text-[15px] font-semibold text-danger">Supprimer la tontine</Text>
      </Pressable>
      <ConfirmSheet
        content={CONFIRM_DELETE}
        visible={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          props.onConfirm();
        }}
      />
    </>
  );
}
