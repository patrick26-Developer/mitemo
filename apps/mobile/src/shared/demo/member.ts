/** Membre affiché tant que l'authentification n'est pas branchée. */
export interface DemoMember {
  readonly name: string;
  readonly avatarInitial: string;
  /** Numéro au format international, affiché en lecture seule sur le profil. */
  readonly phone: string;
  /** Année de création du compte, affichée en pied de profil. */
  readonly createdAt: string;
}

/** Membre de démonstration, commun à l'accueil et au profil. */
export const DEMO_MEMBER: DemoMember = {
  name: "Précieuse",
  avatarInitial: "P",
  phone: "+242 06 512 34 56",
  createdAt: "2026",
};
