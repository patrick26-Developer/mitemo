import { MessageCircle, Phone } from "lucide-react-native";

import { SheetSection } from "./section.sheet";
import type { SupportContact } from "../../support/model.support-contact";
import { SupportContactRow } from "../atoms/row.support-contact";

/** Props de la section de contact du service client. */
export interface SupportContactSectionProps {
  /** Moyens de contact, `null` tant que le numéro n'est pas configuré. */
  readonly contact: SupportContact | null;
  /** Ouvre le lien WhatsApp ou d'appel. */
  readonly onOpen: (url: string) => void;
}

/**
 * Propose de joindre le service client sur WhatsApp ou par un appel.
 * @param props Moyens de contact et ouverture d'un lien.
 * @returns La section, ou rien sans numéro configuré.
 */
export function SupportContactSection(props: SupportContactSectionProps) {
  const { contact, onOpen } = props;
  if (contact === null) return null;

  return (
    <SheetSection title="Service client">
      <SupportContactRow
        icon={MessageCircle}
        label="WhatsApp"
        hint={contact.display}
        accessibilityLabel="Écrire au service client sur WhatsApp"
        onPress={() => onOpen(contact.whatsappUrl)}
      />
      <SupportContactRow
        icon={Phone}
        label="Appeler"
        hint={contact.display}
        accessibilityLabel="Appeler le service client"
        onPress={() => onOpen(contact.callUrl)}
      />
    </SheetSection>
  );
}
