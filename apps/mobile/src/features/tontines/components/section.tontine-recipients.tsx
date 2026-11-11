import { SheetRow } from "../../../shared/components/atoms/row.sheet";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import type { TontineMember } from "../../../shared/member/model.portfolio";

/** Props de la liste des destinataires d'un transfert. */
export interface TontineRecipientsProps {
  readonly members: readonly TontineMember[];
  readonly selected: string;
  readonly onSelect: (memberId: string) => void;
}

/**
 * Propose les membres qui peuvent recevoir un transfert dans une tontine.
 * @param props Membres disponibles, sélection courante et choix.
 * @returns La section des destinataires.
 */
export function TontineRecipients(props: TontineRecipientsProps) {
  const { members, selected, onSelect } = props;

  return (
    <SheetSection title="Destinataire">
      {members.map((member) => (
        <SheetRow
          key={member.id}
          label={member.name}
          selected={selected === member.id}
          onPress={() => onSelect(member.id)}
        />
      ))}
    </SheetSection>
  );
}
