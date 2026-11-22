/** Extension des variables connues de Node pour l'inlining statique Expo. */
declare namespace NodeJS {
  /** Variables publiques du bundle ; aucune clé secrète n'est déclarée ici. */
  interface ProcessEnv {
    /** Origine publique de l'API, validée à la frontière de configuration. */
    EXPO_PUBLIC_API_URL?: string;
  }
}
