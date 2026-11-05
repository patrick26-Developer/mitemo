# api

API de Mitemo : NestJS 12 (ESM), Prisma 7 et PostgreSQL. C'est le noyau métier : identité, tontines, grand livre en partie double, paiements et canaux (USSD, SMS).

Responsable : Patrick (`patrick26-Developer`). Issues : [label `app:api`](https://github.com/patrick26-Developer/mitemo/issues?q=is%3Aissue+is%3Aopen+label%3Aapp%3Aapi).

## Démarrer

Depuis la racine du dépôt, après `pnpm install` :

```bash
cp apps/api/.env.example apps/api/.env   # puis renseigner les URL PostgreSQL
pnpm --filter api build
pnpm --filter api start                   # écoute sur PORT (3000 par défaut)
curl localhost:3000/health                # {"status":"ok"}
```

## Variables d'environnement

| Variable              | Rôle                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `PORT`                | Port HTTP, entier de 1 à 65535. 3000 par défaut, l'API refuse de démarrer sur une valeur invalide |
| `DATABASE_URL`        | Connexion **directe** à PostgreSQL : écritures du grand livre et migrations                       |
| `DATABASE_POOLED_URL` | Connexion poolée, lectures simples uniquement                                                     |

Sur Neon, l'URL directe est celle **sans** `-pooler` dans le nom d'hôte : le pooler casse les verrous et les transactions `SERIALIZABLE`.

## Scripts

| Commande                           | Effet                                                   |
| ---------------------------------- | ------------------------------------------------------- |
| `pnpm --filter api test`           | Tests unitaires (Vitest, SWC pour les décorateurs)      |
| `pnpm --filter api test:ci`        | Tests unitaires avec seuils de couverture               |
| `pnpm --filter api test:e2e`       | Tests de bout en bout (application complète, Supertest) |
| `pnpm --filter api typecheck`      | Vérification TypeScript                                 |
| `pnpm --filter api build`          | Génère le client Prisma puis compile dans `dist/`       |
| `pnpm --filter api prisma:migrate` | Crée et applique une migration (base de développement)  |

## Organisation

```
src/
  features/<feature>/
    domain/          entités, value objects, ports (aucune dépendance à NestJS ni Prisma)
    application/     cas d'usage, une classe par cas, une méthode execute()
    infrastructure/  adaptateurs (Prisma, opérateurs de paiement)
    presentation/    contrôleurs et DTO
    <feature>.module.ts
  shared/            briques transverses sans logique métier
  generated/         client Prisma généré, non versionné
  main.ts
prisma/              schema.prisma et migrations
test/                tests e2e
```

Feature existante : `health` (`GET /health`, sonde de vie).

## Règles propres à l'API

- Montants en `BIGINT` côté base et `bigint` côté code, jamais de flottant. En JSON, un montant est une chaîne d'entier (`@mitemo/contracts`).
- Aucune écriture du grand livre n'est modifiée ni supprimée : une correction est une contre-écriture.
- Toute écriture porte une clé d'idempotence.
- Une migration fusionnée n'est jamais modifiée.
- Ne jamais journaliser un PIN, un OTP ou un numéro complet.

Règles générales : [`AGENTS.md`](../../AGENTS.md). Architecture cible : [`docs/audit/03-architecture-technique.md`](../../docs/audit/03-architecture-technique.md).
