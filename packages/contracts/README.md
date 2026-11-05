# @mitemo/contracts

Types et interfaces partagés entre `apps/api`, `apps/web` et `apps/mobile`. Source unique de vérité pour tout ce qui traverse le réseau.

## Contenu

| Fichier          | Rôle                                                              |
| ---------------- | ----------------------------------------------------------------- |
| `brand.ts`       | Types nominaux (`Brand`) pour ne pas confondre deux identifiants  |
| `identifiers.ts` | `GroupId`, `MemberId`, `ContributionId`                           |
| `money.ts`       | `AmountMinor` (bigint), `MoneyDto` (chaîne), lecture et écriture  |
| `api-error.ts`   | Format unique des erreurs de l'API                                |

## Utilisation

```ts
import { parseAmount, type MoneyDto } from "@mitemo/contracts";
```

Toujours importer depuis la racine du paquet, jamais un fichier interne.

## Règles

Voir `AGENTS.md`, section « Types et interfaces partagés ».
