/** Notification affichée dans la feuille de l'accueil. */
export interface HomeNotification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  /** Moment relatif, en français, par exemple « Il y a 2 h ». */
  readonly time: string;
}

/** Notifications de démonstration. */
export const HOME_NOTIFICATIONS: readonly HomeNotification[] = [
  {
    id: "1",
    title: "Cotisation enregistrée",
    message: "Votre cotisation de 5 000 FCFA pour la Tontine du Marché Tolal est confirmée.",
    time: "Il y a 2 h",
  },
  {
    id: "2",
    title: "Tour 4 sur 10",
    message: "Mama Nadège reçoit le pot cette semaine. Le prochain tour commence lundi.",
    time: "Hier",
  },
  {
    id: "3",
    title: "Objectif bientôt atteint",
    message: "Il reste 10 000 FCFA pour terminer la carte « Loyer de Janvier ».",
    time: "Il y a 3 jours",
  },
];
