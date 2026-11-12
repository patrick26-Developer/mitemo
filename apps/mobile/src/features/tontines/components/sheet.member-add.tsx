import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { MemberContact } from "../../../shared/member/model.portfolio-create";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { useMemberPicker } from "../hooks/hook.member-picker";
import { MemberContactRow } from "./row.member-contact";

/** Props de la feuille d'ajout d'un membre. */
export interface MemberAddSheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  readonly onClose: () => void;
  /** Invite le contact choisi ; il rejoint la tontine s'il accepte. */
  readonly onAdd: (contact: MemberContact) => void;
  /** Partage le lien d'invitation, pour qui n'a pas encore de compte. */
  readonly onShare: () => void;
}

/**
 * Propose d'inviter un contact du répertoire qui a un compte Mitemo : comme
 * pour un groupe WhatsApp, il n'est pas ajouté d'office mais reçoit une
 * invitation qu'il accepte ou refuse. Pour les autres, le lien d'invitation se
 * partage depuis le pied de la feuille.
 * @param props Visibilité, tontine, fermeture, inscription et partage.
 * @returns La feuille « Ajouter un membre ».
 */
export function MemberAddSheet(props: MemberAddSheetProps) {
  const { visible, item, onClose, onAdd, onShare } = props;

  return (
    <BottomSheet
      visible={visible}
      title="Inviter un membre"
      onClose={onClose}
      footer={<SheetSecondaryButton label="Partager le lien d'invitation" onPress={onShare} />}
    >
      <SheetText>
        Le contact reçoit une invitation : il rejoint la tontine s&apos;il l&apos;accepte, en
        choisissant son nombre de tours.
      </SheetText>
      {visible ? (
        <MemberPicker
          item={item}
          onAdd={(contact) => {
            onAdd(contact);
            onClose();
          }}
        />
      ) : null}
    </BottomSheet>
  );
}

/** Props de la liste des contacts proposés. */
interface MemberPickerProps {
  readonly item: Tontine;
  readonly onAdd: (contact: MemberContact) => void;
}

/**
 * Cherche les contacts à l'ouverture et affiche, selon le cas, l'attente,
 * l'accès refusé, l'absence de contact ou la liste.
 * @param props Tontine et inscription.
 * @returns Le contenu de la feuille.
 */
function MemberPicker(props: MemberPickerProps) {
  const { item } = props;
  const known = useMemo(() => [...item.members, ...item.invitations], [item]);
  const state = useMemberPicker(known);

  if (state.status === "loading") {
    return <ActivityIndicator testID="member-picker-loading" color={PALETTE.brand} />;
  }
  if (state.status === "denied") {
    return (
      <SheetText>
        Autorisez l&apos;accès à vos contacts pour retrouver ceux qui ont un compte Mitemo, ou
        partagez le lien d&apos;invitation.
      </SheetText>
    );
  }
  if (state.contacts.length === 0) {
    return (
      <SheetText>
        Aucun de vos contacts n&apos;a encore de compte Mitemo, ou tous sont déjà invités. Partagez
        le lien d&apos;invitation aux autres.
      </SheetText>
    );
  }
  return (
    <SheetSection title="Vos contacts sur Mitemo">
      <View className="gap-2">
        {state.contacts.map((contact) => (
          <MemberContactRow
            key={contact.phone}
            contact={contact}
            onPress={() => props.onAdd(contact)}
          />
        ))}
      </View>
    </SheetSection>
  );
}
