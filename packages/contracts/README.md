# @mitemo/contracts

Types et interfaces partagés entre `apps/api`, `apps/web` et `apps/mobile`. Source unique de vérité pour tout ce qui traverse le réseau.

## Contenu

| Fichier          | Rôle                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `brand.ts`       | Types nominaux (`Brand`) pour ne pas confondre deux identifiants                                    |
| `identifiers.ts` | `GroupId`, `MemberId`, `ContributionId`, `TontineId`, `RoundId`, `TransactionId`, `InvitationToken` |
| `datetime.ts`    | `IsoDateTime` : date ISO 8601 UTC, brandée pour ne pas accepter une chaîne quelconque               |
| `money.ts`       | `AmountMinor` (bigint), `MoneyDto` (chaîne), lecture et écriture                                    |
| `api-error.ts`   | Format unique des erreurs de l'API                                                                  |
| `health.ts`      | Réponse de `GET /health`                                                                            |
| `tontine.ts`     | Automate tontine, fréquence du cycle, création d'une tontine                                        |
| `membership.ts`  | Automate d'adhésion, invitation, adhésion à une tontine                                             |
| `round.ts`       | Automate d'un tour, arbitrage Accepter/Annuler, distribution de la cagnotte                         |
| `transaction.ts` | Automate de transaction, approvisionnement du portefeuille                                          |

## Utilisation

```ts
import { parseAmount, type MoneyDto } from "@mitemo/contracts";
```

Toujours importer depuis la racine du paquet, jamais un fichier interne.

## Règles

Voir `AGENTS.md`, section « Types et interfaces partagés ».
