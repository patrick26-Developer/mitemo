/** Question fréquente affichée dans le centre d'aide. */
export interface ProfileFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

/** Section d'un document légal. */
export interface ProfileLegalSection {
  readonly title: string;
  readonly body: string;
}

/** Questions fréquentes du centre d'aide. */
export const PROFILE_FAQ: readonly ProfileFaqItem[] = [
  {
    id: "photo",
    question: "Comment changer ma photo ?",
    answer:
      "Touchez votre photo en haut du profil, puis choisissez une image dans votre galerie. Elle est compressée et affichée partout dans l'application.",
  },
  {
    id: "cotisation",
    question: "Quand ma cotisation est-elle enregistrée ?",
    answer:
      "Une cotisation est enregistrée dès que le paiement est confirmé. Elle apparaît alors dans l'historique et dans l'avancement du tour.",
  },
  {
    id: "securite",
    question: "Que faire si mon téléphone est perdu ?",
    answer:
      "Contactez le support depuis un autre appareil. Votre session sera fermée et votre PIN devra être réinitialisé.",
  },
];

/** Sections de la politique de confidentialité. */
export const PRIVACY_SECTIONS: readonly ProfileLegalSection[] = [
  {
    title: "Données collectées",
    body: "Mitemo conserve votre nom, votre numéro de téléphone, votre photo de profil et l'historique de vos opérations. Aucune donnée bancaire complète n'est stockée sur l'appareil.",
  },
  {
    title: "Utilisation",
    body: "Ces données servent uniquement à faire fonctionner vos tontines et vos cartes de pointage, à vous notifier les échéances et à sécuriser votre compte.",
  },
  {
    title: "Conservation",
    body: "Vos données sont conservées pendant la durée d'utilisation du compte, puis archivées selon les obligations légales de la zone CEMAC.",
  },
];

/** Sections des conditions d'utilisation. */
export const TERMS_SECTIONS: readonly ProfileLegalSection[] = [
  {
    title: "Objet du service",
    body: "Mitemo facilite l'organisation de tontines et de cartes de pointage entre membres d'un même groupe. La plateforme n'est pas un établissement de crédit.",
  },
  {
    title: "Engagements du membre",
    body: "Le membre s'engage à fournir des informations exactes, à respecter les règles de son groupe et à cotiser aux échéances convenues.",
  },
  {
    title: "Résiliation",
    body: "Un compte peut être fermé à tout moment depuis le profil. Les tontines en cours restent soumises aux règles du groupe jusqu'à leur clôture.",
  },
];
