/**
 * Rappel des conditions d'utilisation, montré avant la création du compte.
 * C'est un résumé ; le texte complet est dans le profil. La version
 * définitive doit être validée juridiquement avant la mise en production.
 */
export const TERMS_POINTS: readonly string[] = [
  "Votre compte est personnel : ne communiquez jamais votre code PIN, même à un proche ou à un agent Mitemo.",
  "En rejoignant une tontine, vous vous engagez à verser chaque cotisation à temps, jusqu'au dernier tour.",
  "Les paiements et les retraits passent par MTN MoMo ou Airtel Money, à votre nom.",
  "Mitemo n'est pas une banque : l'application ne prête pas d'argent et ne verse pas d'intérêts.",
  "Votre numéro et votre profil servent uniquement à faire fonctionner vos tontines et vos cartes de pointage.",
];

/** Message affiché quand le membre refuse les conditions. */
export const TERMS_DECLINED = "Acceptez les conditions d'utilisation pour créer votre compte.";
