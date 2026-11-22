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
import type { MemberContactAction } from "./row.member-contact";

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
    <BottomSheet visible={visible} title="Inviter un membre" onClose={onClose}>
      <SheetText>
        Le contact reçoit une invitation : il rejoint la tontine s&apos;il l&apos;accepte, en
        choisissant son nombre de tours.
      </SheetText>
      {visible ? (
        <MemberPicker
          item={item}
          onShare={onShare}
          onAdd={(contact) => {
            onAdd(contact);
            onClose();
          }}
        />
      ) : null}
    </BottomSheet>
  );
}

/** Props de la liste des contacts. */
interface MemberPickerProps {
  readonly item: Tontine;
  readonly onAdd: (contact: MemberContact) => void;
  /** Partage le lien d'invitation à rejoindre Mitemo. */
  readonly onShare: () => void;
}

/**
 * Contacts du répertoire, comme dans l'ajout d'un groupe WhatsApp : ceux qui
 * ont un compte Mitemo, à ajouter, puis les autres, à inviter sur Mitemo.
 * @param props Tontine, ajout et partage.
 * @returns La liste, ou l'état de chargement ou d'accès refusé.
 */
function MemberPicker(props: MemberPickerProps) {
  const known = useMemo(() => [...props.item.members, ...props.item.invitations], [props.item]);
  const state = useMemberPicker(known);

  if (state.status === "loading") {
    return <ActivityIndicator testID="member-picker-loading" color={PALETTE.brand} />;
  }
  if (state.status === "denied") return <ContactsDenied onShare={props.onShare} />;
  if (state.onMitemo.length + state.others.length === 0) {
    return (
      <SheetText>
        Aucun de vos contacts n&apos;est à inviter : tous sont déjà membres ou invités.
      </SheetText>
    );
  }
  return (
    <>
      <ContactGroup
        title="Sur Mitemo"
        contacts={state.onMitemo}
        action="add"
        onPress={props.onAdd}
      />
      <ContactGroup
        title="Inviter sur Mitemo"
        contacts={state.others}
        action="invite"
        onPress={props.onShare}
      />
    </>
  );
}

/** Props d'un groupe de contacts. */
interface ContactGroupProps {
  readonly title: string;
  readonly contacts: readonly MemberContact[];
  readonly action: MemberContactAction;
  readonly onPress: (contact: MemberContact) => void;
}

/**
 * Groupe de contacts sous son titre ; rien quand il est vide.
 * @param props Titre, contacts, action et toucher.
 * @returns Le groupe, ou rien.
 */
function ContactGroup(props: ContactGroupProps) {
  const { title, contacts, action, onPress } = props;
  if (contacts.length === 0) return null;

  return (
    <SheetSection title={title}>
      <View className="gap-2">
        {contacts.map((contact) => (
          <MemberContactRow
            key={contact.phone}
            contact={contact}
            action={action}
            onPress={() => onPress(contact)}
          />
        ))}
      </View>
    </SheetSection>
  );
}

/** Props de l'accès refusé au répertoire. */
interface ContactsDeniedProps {
  readonly onShare: () => void;
}

/**
 * Accès au répertoire refusé : on peut encore partager le lien d'invitation.
 * @param props Partage du lien.
 * @returns L'explication et le partage.
 */
function ContactsDenied(props: ContactsDeniedProps) {
  return (
    <>
      <SheetText>
        Autorisez l&apos;accès à vos contacts pour les retrouver ici, ou partagez le lien
        d&apos;invitation.
      </SheetText>
      <SheetSecondaryButton label="Partager le lien d'invitation" onPress={props.onShare} />
    </>
  );
}
