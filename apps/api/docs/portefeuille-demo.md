# Portefeuille P1 pour Expo

Les routes ci-dessous sont destinées au lot P1. Pour l’identité déjà publiée sur la branche P0, voir [le guide P0](identite-demo.md).

Configurer `EXPO_PUBLIC_API_URL` avec l’URL HTTPS affichée par Render une fois le service opérationnel. En local, utiliser l’adresse du poste ou `http://10.0.2.2:3000` depuis l’émulateur Android.

Chaque requête portefeuille en Preview utilise `Authorization: Bearer <accessToken>` et `X-Mitemo-Preview-Key: <clé du testeur>`. Obtenir la clé hors bande. Elle est extractible d’un bundle et ne doit jamais être intégrée à une application distribuée. La session identifie l’utilisateur.

| Route | Requête | Réponse |
| --- | --- | --- |
| GET /wallet | Sans corps | `WalletSummaryResponse`, avec `available`, `committed`, `pending`, `blocked` et `simulated` |
| GET /wallet/movements | `limit` facultatif de 1 à 50, 20 par défaut. `cursor` repris du `nextCursor` précédent. | `WalletMovementsResponse`, avec `items` et éventuellement `nextCursor` |
| POST /wallet/demo-funding | En-tête `Idempotency-Key` UUID. Corps `{"amount":{"amount":"5000","currency":"XAF"}}`. | HTTP 200, `SimulateFundingResponse` avec état `CONFIRMED` et `simulated: true` |

Un rejeu avec le même UUID et le même utilisateur renvoie la même confirmation. Un versement volontairement distinct utilise un nouvel UUID. Les montants sont des chaînes décimales signées en FCFA entiers, par exemple `"5000"`. Les trois autres positions restent à zéro tant que les programmes et opérations correspondants sont absents.

Gérer `400` pour un montant, une clé ou un curseur invalide, `401` pour une clé Preview ou une session invalide et `404` lorsque le mode de démonstration est fermé. En cas d’expiration réseau après un versement, conserver le même UUID pour réessayer.

## Vérification PostgreSQL dans pgAdmin

À exécuter en lecture seule sur la base de développement. Remplacer le UUID exemple par celui de la réponse `GET /me`.

```sql
SELECT u.id, a.id AS wallet_account, a.kind, COALESCE(SUM(l.amount), 0) AS available_xaf
FROM app_user u
JOIN ledger_account a ON a.id = u.wallet_account_id
LEFT JOIN ledger_posting_line l ON l.account_id = a.id
WHERE u.id = '00000000-0000-4000-8000-000000000000'
GROUP BY u.id, a.id, a.kind;
```

Remplacer ensuite le UUID exemple par le `transactionId` reçu après le versement.

```sql
SELECT e.id, e.settlement_mode, COUNT(*) AS posting_count, SUM(l.amount) AS net_xaf
FROM ledger_entry e
JOIN ledger_posting_line l ON l.entry_id = e.id
WHERE e.id = '00000000-0000-4000-8000-000000000000'
GROUP BY e.id, e.settlement_mode;
```

Le versement doit donner deux lignes, un total signé nul et le mode `SIMULATED`. Aucune donnée bancaire ou de paiement réel n’est utilisée.
