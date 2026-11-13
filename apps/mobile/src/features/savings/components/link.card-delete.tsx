import { useState } from "react";
import { Pressable, Text } from "react-native";

import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";

/** Confirmation de la suppression d'une carte. */
const CONFIRM_DELETE: ConfirmSheetContent = {
  title: "Supprimer la carte ?",
  message: "La carte n'a reçu aucun pointage : elle disparaît, sans argent en jeu.",
  confirmLabel: "Supprimer",
  tone: "danger",
};

/** Props du lien de suppression. */
export interface CardDeleteLinkProps {
  readonly onConfirm: () => void;
}

/**
 * Lien rouge « Supprimer la carte », confirmé dans une feuille.
 * @param props Suppression confirmée.
 * @returns Le lien et sa confirmation.
 */
export function CardDeleteLink(props: CardDeleteLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Supprimer la carte"
        onPress={() => setOpen(true)}
        className="min-h-11 items-center justify-center"
      >
        <Text className="text-[15px] font-semibold text-danger">Supprimer la carte</Text>
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
