import { EllipsisVertical } from "lucide-react-native";
import { useState } from "react";

import { DetailHeader } from "../../../shared/components/macros/header.detail";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { SavingsOptionsSheet } from "./sheet.savings-options";

/** Props de l'en-tête du détail d'une carte. */
export interface SavingsDetailHeaderProps {
  readonly item: SavingsCard;
}

/**
 * En-tête du détail d'une carte, avec le bouton « ⋮ » de ses options.
 * @param props Carte affichée.
 * @returns L'en-tête et la feuille d'options.
 */
export function SavingsDetailHeader(props: SavingsDetailHeaderProps) {
  const { item } = props;
  const [open, setOpen] = useState(false);
  const more = {
    label: "Options de la carte",
    icon: EllipsisVertical,
    onPress: () => setOpen(true),
  };

  return (
    <>
      <DetailHeader title={item.name} accent={item.tint} actions={[more]} />
      <SavingsOptionsSheet visible={open} item={item} onClose={() => setOpen(false)} />
    </>
  );
}
