/** Réponse de `GET /support/contact` : comment joindre le service client. */
export interface SupportContactResponse {
  /** Numéro du service client, au format E.164 (par exemple « +242065706622 »), joint par WhatsApp ou par appel. */
  readonly phoneNumber: string;
  /** Durée pendant laquelle le client peut garder ce numéro en cache, en secondes. */
  readonly maxAgeSeconds: number;
}
