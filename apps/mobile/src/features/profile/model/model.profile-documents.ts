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

/**
 * Sections de la politique de confidentialité. Texte de travail : il doit
 * être validé juridiquement avant la mise en production.
 */
export const PRIVACY_SECTIONS: readonly ProfileLegalSection[] = [
  {
    title: "Données collectées",
    body: "Pour faire fonctionner votre compte, Mitemo enregistre votre nom, votre numéro de téléphone, votre photo de profil si vous en choisissez une, les tontines et les cartes de pointage auxquelles vous participez, ainsi que l'historique de vos cotisations, pointages et retraits. Votre code PIN n'est jamais conservé en clair : seule une empreinte chiffrée est gardée. Mitemo ne stocke pas les identifiants de vos comptes MTN MoMo ou Airtel Money.",
  },
  {
    title: "Finalités",
    body: "Ces données servent uniquement à créer et sécuriser votre compte, à organiser vos tontines et vos cartes de pointage, à enregistrer vos paiements, à vous rappeler vos échéances et à répondre à vos demandes d'assistance. Elles ne sont jamais vendues ni utilisées pour de la publicité ciblée.",
  },
  {
    title: "Partage des données",
    body: "Les membres d'une même tontine voient votre nom, votre photo et l'état de vos cotisations dans cette tontine, et rien d'autre. Les opérateurs de paiement (MTN MoMo, Airtel Money) reçoivent le numéro et le montant nécessaires à chaque opération. Des prestataires techniques (hébergement, envoi de notifications, suivi des erreurs) traitent certaines données pour notre compte, sous contrat et sans droit de les réutiliser.",
  },
  {
    title: "Hébergement et transferts",
    body: "Pendant la phase pilote, les données sont hébergées dans un centre de données situé dans l'Union européenne (Francfort). Avant l'ouverture au public, une copie sera conservée dans la zone CEMAC, conformément aux exigences applicables. Tout transfert hors du Congo est encadré par des garanties de sécurité et de confidentialité.",
  },
  {
    title: "Sécurité",
    body: "Les échanges entre l'application et nos serveurs sont chiffrés. Votre session est protégée par votre code PIN et se ferme si vous vous déconnectez. Les accès internes aux données sont limités aux personnes qui en ont besoin et sont journalisés. En cas de faille touchant vos données, vous en serez informé dans les meilleurs délais.",
  },
  {
    title: "Conservation",
    body: "Vos données sont conservées tant que votre compte est actif. Après sa fermeture, l'historique des opérations financières est archivé pendant la durée imposée par les obligations comptables et de lutte contre la fraude, puis supprimé. Les autres données (photo, préférences) sont effacées dès la fermeture du compte.",
  },
  {
    title: "Vos droits",
    body: "Conformément à la loi n° 29-2019 du 10 octobre 2019 portant protection des données à caractère personnel en République du Congo, vous pouvez accéder à vos données, les faire rectifier, demander leur effacement ou vous opposer à certains traitements. Vous pouvez aussi saisir l'autorité de protection des données compétente si vous estimez que vos droits ne sont pas respectés.",
  },
  {
    title: "Nous contacter",
    body: "Pour exercer vos droits ou poser une question sur vos données, écrivez au service client depuis « Aide et assistance » dans votre profil, ou à support@mitemo.app. Nous répondons dans un délai d'un mois au plus, et nous pouvons vous demander de confirmer votre identité avant de répondre.",
  },
];

/**
 * Sections des conditions d'utilisation. Texte de travail : il doit être
 * validé juridiquement avant la mise en production.
 */
export const TERMS_SECTIONS: readonly ProfileLegalSection[] = [
  {
    title: "Objet du service",
    body: "Mitemo est une application qui aide des groupes de confiance à organiser des tontines et permet à chacun de suivre son épargne avec des cartes de pointage. Mitemo n'est ni une banque ni un établissement de crédit : l'application ne prête pas d'argent et ne verse pas d'intérêts.",
  },
  {
    title: "Création du compte",
    body: "Le compte est personnel et lié à votre numéro de téléphone. Vous devez être majeur, fournir des informations exactes et garder votre code PIN secret, y compris vis-à-vis de vos proches et des agents Mitemo, qui ne vous le demanderont jamais. Toute opération validée avec votre code est réputée faite par vous.",
  },
  {
    title: "Tontines",
    body: "En rejoignant une tontine, vous acceptez ses règles : montant de la cotisation, fréquence, nombre de tours et ordre de passage. Vous vous engagez à cotiser à chaque échéance jusqu'au dernier tour. L'administrateur peut supprimer une tontine tant qu'aucune cotisation n'a été versée ; les membres en sont alors informés et ne peuvent plus y cotiser.",
  },
  {
    title: "Cartes de pointage",
    body: "Une carte de pointage fixe un objectif d'épargne, un montant par pointage et une échéance. Chaque pointage ajoute ce montant à votre épargne. L'argent épargné peut être retiré selon les règles de la carte ; une carte sans aucun pointage peut être supprimée à tout moment.",
  },
  {
    title: "Paiements et retraits",
    body: "Les cotisations, pointages et retraits passent par MTN MoMo, Airtel Money ou votre solde Mitemo, à votre nom. Une opération n'est enregistrée qu'une fois confirmée par l'opérateur. Mitemo ne peut pas annuler un paiement confirmé par erreur ; contactez le service client, qui vous aidera auprès de l'opérateur.",
  },
  {
    title: "Frais",
    body: "Mitemo prélève des frais de service de 10 % : sur une carte, 10 % de l'objectif, répartis en petites parts sur chaque pointage ; sur une tontine, 10 % de chaque cotisation. Le montant affiché sur le bouton et dans la feuille de paiement est toujours le montant réellement prélevé, frais compris. Les frais de l'opérateur de paiement éventuels restent à votre charge.",
  },
  {
    title: "Responsabilités",
    body: "Mitemo met tout en œuvre pour que l'application soit disponible et que vos opérations soient enregistrées correctement. Mitemo n'est pas responsable d'un membre qui ne verse pas sa cotisation, ni des interruptions propres aux opérateurs de paiement ou au réseau mobile. Les litiges entre membres d'une tontine se règlent d'abord au sein du groupe.",
  },
  {
    title: "Résiliation",
    body: "Vous pouvez fermer votre compte à tout moment depuis le service client. Les tontines en cours restent soumises à leurs règles jusqu'à leur clôture, et l'épargne de vos cartes vous est reversée. Mitemo peut suspendre un compte en cas de fraude, d'usurpation d'identité ou de manquement grave à ces conditions, après vous en avoir informé sauf urgence.",
  },
  {
    title: "Droit applicable",
    body: "Les présentes conditions sont régies par le droit de la République du Congo. Elles peuvent évoluer : toute modification importante vous est annoncée dans l'application avant d'entrer en vigueur. En cas de désaccord, une solution amiable est recherchée avec le service client avant tout recours devant les juridictions compétentes.",
  },
];
