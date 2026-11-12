# Connexion à l'API

Couche réseau du mobile. Les écrans n'appellent jamais `fetch` : ils passent par
`identityApi` et `accountApi` (`config.api.ts`), typés par `@mitemo/contracts`.

## Règles de sécurité

| Risque                                | Parade                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Trafic en clair                       | `parseApiBaseUrl` impose HTTPS ; HTTP seulement en `__DEV__` vers la machine ou le réseau local. URL refusée : aucun appel.          |
| Secret glissé dans l'URL              | Identifiants, requête et ancre refusés dans `EXPO_PUBLIC_API_URL`.                                                                   |
| Vol du jeton sur l'appareil           | Jeton dans le trousseau (`expo-secure-store`), `WHEN_UNLOCKED_THIS_DEVICE_ONLY` : ni sauvegarde, ni autre appareil, jamais en clair. |
| Jeton expiré ou rejoué                | Jamais envoyé à moins de 30 s de son expiration ; un seul renouvellement partagé sur un 401, puis déconnexion.                       |
| Réponse inattendue ou malveillante    | Chaque réponse est validée par un schéma zod avant usage ; un écart lève `ApiUnavailableError("invalid-response")`.                  |
| Écran bloqué par un réseau lent       | Délai maximal de 15 s par requête (`AbortController`).                                                                               |
| Double débit sur une écriture rejouée | Clé `Idempotency-Key` tirée d'un UUID cryptographique sur les écritures marquées `idempotent`.                                       |
| Fuite dans les journaux               | Rien n'est journalisé : ni PIN, ni OTP, ni jeton, ni numéro.                                                                         |
| Cache d'une réponse sensible          | `cache: "no-store"` sur chaque requête ; l'API répond aussi `Cache-Control: no-store`.                                               |

## Erreurs

- `ApiClientError` : l'API a répondu par une erreur du contrat (`code`, `traceId`, `fields`).
- `ApiUnavailableError` : URL non configurée, délai dépassé, réseau coupé ou réponse hors contrat.

## Limites connues

- L'environnement de préversion de l'API exige l'en-tête `x-mitemo-preview-key`. Une application
  mobile ne peut pas garder ce secret : le mobile vise une API sans cette clé.
- Pas encore d'épinglage de certificat : il demande un module natif et une build de développement.
- La route `POST /notifications/push-tokens` n'existe pas encore côté API.
