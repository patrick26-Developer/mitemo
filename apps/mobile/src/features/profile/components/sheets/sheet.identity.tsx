import { useState } from "react";

import { DetailCard } from "../../../../shared/components/macros/card.detail";
import { DetailRow } from "../../../../shared/components/atoms/row.detail";
import { SheetSecondaryButton } from "../../../../shared/components/atoms/button.sheet-secondary";
import { SheetSection } from "../../../../shared/components/macros/section.sheet";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
import { formatDate } from "../../../../shared/format/format.date";
import { useMemberStore } from "../../../../shared/member/store.member";
import { IdentityEditForm } from "./form.identity-edit";

/**
 * Affiche les informations d'identité du membre connecté et permet de les
 * compléter.
 * @returns Le contenu de la feuille « Informations personnelles ».
 */
export function IdentitySheet() {
  const [editing, setEditing] = useState(false);

  if (editing) return <IdentityEditForm onDone={() => setEditing(false)} />;

  return <IdentitySummary onEdit={() => setEditing(true)} />;
}

/** Props du résumé d'identité. */
interface IdentitySummaryProps {
  readonly onEdit: () => void;
}

/**
 * Affiche l'identité en lecture seule, avec l'action de modification.
 * @param props Ouverture du formulaire de modification.
 * @returns Le résumé d'identité.
 */
function IdentitySummary(props: IdentitySummaryProps) {
  const { onEdit } = props;
  const firstName = useMemberStore((state) => state.firstName);
  const lastName = useMemberStore((state) => state.lastName);
  const occupation = useMemberStore((state) => state.occupation);
  const phone = useMemberStore((state) => state.phone);
  const createdAt = useMemberStore((state) => state.createdAt);

  return (
    <>
      <SheetSection title="Identité">
        <DetailCard>
          <DetailRow label="Prénom" value={firstName} />
          <DetailRow label="Nom" value={lastName} />
          <DetailRow label="Profession ou formation" value={occupation} />
          <DetailRow label="Téléphone" value={phone} />
          <DetailRow label="Compte créé le" value={formatDate(createdAt)} />
        </DetailCard>
      </SheetSection>
      <SheetSecondaryButton label="Modifier mes informations" onPress={onEdit} />
      <SheetText>
        {
          "Votre numéro sert à retrouver vos tontines et à sécuriser vos connexions. Il n'est jamais partagé avec les autres membres."
        }
      </SheetText>
    </>
  );
}
