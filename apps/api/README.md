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

### Base de développement : une branche Neon par développeur

Chaque développeur travaille sur sa propre branche Neon, jamais sur une base partagée :

1. Dans la console Neon (ou `neonctl branches create --name <prenom>`), créer une branche personnelle à partir de `main` (la branche Neon par défaut du projet).
2. Copier ses deux chaînes de connexion (directe et poolée) dans `apps/api/.env` - jamais commité (`.gitignore` l'exclut déjà).
3. Les tests d'intégration (`*.int-spec.ts`) ne tournent **jamais** contre Neon : ils appliquent les migrations puis écrivent des écritures que la base interdit de supprimer. Ils exigent une base dédiée et jetable, désignée par `TEST_DATABASE_URL`, et refusent de démarrer sans elle ou si elle désigne un hôte `*.neon.tech`. En CI, c'est le service PostgreSQL du workflow (`.github/workflows/ci.yml`). En local :

   ```sh
   docker run -d --rm --name mitemo-test-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mitemo_test -p 55432:5432 postgres:18
   TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:55432/mitemo_test pnpm --filter api test:int
   ```

   `docker rm -f mitemo-test-pg` supprime la base de test. La mise en place globale (`test/int/global-setup.ts`) applique les migrations avec `prisma migrate deploy`, qui n'efface rien. La couverture de l'adaptateur Prisma est mesurée séparément par `pnpm --filter api test:int:ci` et publiée dans `coverage-int/`.

## Scripts

| Commande                           | Effet                                                   |
| ---------------------------------- | ------------------------------------------------------- |
| `pnpm --filter api test`           | Tests unitaires (Vitest, SWC pour les décorateurs)      |
| `pnpm --filter api test:ci`        | Tests unitaires avec seuils de couverture               |
| `pnpm --filter api test:e2e`       | Tests de bout en bout (application complète, Supertest) |
| `pnpm --filter api test:int`       | Tests d'intégration contre une vraie base PostgreSQL    |
| `pnpm --filter api test:int:ci`    | Idem, avec couverture de l'adaptateur PostgreSQL        |
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

Features existantes : `health` (`GET /health`, sonde de vie) et `ledger`
(grand livre en partie double : domaine, persistance PostgreSQL et garanties
en base ; aucun endpoint HTTP à ce stade).

## Règles propres à l'API

- Montants en `BIGINT` côté base et `bigint` côté code, jamais de flottant. En JSON, un montant est une chaîne d'entier (`@mitemo/contracts`).
- Aucune écriture du grand livre n'est modifiée ni supprimée : une correction est une contre-écriture qui annule exactement les lignes de l'originale.
- Toute écriture porte une clé d'idempotence. Un rejeu doit avoir le même contenu et le même auteur ; une clé réutilisée par un autre auteur est un conflit.
- Une migration fusionnée n'est jamais modifiée.
- Ne jamais journaliser un PIN, un OTP ou un numéro complet.

Règles générales : [`AGENTS.md`](../../AGENTS.md). Architecture cible : [`docs/audit/03-architecture-technique.md`](../../docs/audit/03-architecture-technique.md).
