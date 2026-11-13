import { useState } from "react";

import { SheetSecondaryButton } from "../../../../shared/components/atoms/button.sheet-secondary";
import { MemberFactList } from "../../../../shared/components/macros/list.member-facts";
import { SheetText } from "../../../../shared/components/atoms/text.sheet";
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
 * Affiche l'identité en lecture seule, au style de la feuille « Mes
 * informations » de l'accueil, avec le bouton de modification.
 * @param props Ouverture du formulaire de modification.
 * @returns Le résumé d'identité.
 */
function IdentitySummary(props: IdentitySummaryProps) {
  return (
    <>
      <MemberFactList />
      <SheetSecondaryButton label="Modifier mes informations" onPress={props.onEdit} />
      <SheetText>
        {
          "Votre numéro sert à retrouver vos tontines et à sécuriser vos connexions. Il n'est jamais partagé avec les autres membres."
        }
      </SheetText>
    </>
  );
}
