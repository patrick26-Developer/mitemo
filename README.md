# Mitemo

L'épargne solidaire connectée. Mitemo numérise les tontines et caisses de solidarité du secteur informel congolais : les fonds sont sécurisés, les cotisations coûtent moins cher en frais et la discipline d'épargne devient un historique financier exploitable.

Projet présenté au concours U-Shine Congo 2026, thématique « L'inclusion financière par l'infrastructure numérique ».

## Documentation

| Document                                                                        | Contenu                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Vision et stratégie](docs/document_vision_strat_gie_mitemo.md)                 | Problème, proposition de valeur, marché, périmètre           |
| [Cahier des charges fonctionnel](docs/cahier_des_charges_fonctionnel_mitemo.md) | Besoins fonctionnels                                         |
| [Audit externe](docs/audit/README.md)                                           | Modèle économique, conformité, architecture, budget, risques |
| [Architecture système](docs/architecture-systeme.md)                            | Surfaces, API, données, authentification, environnements     |
| [Architecture de l'information](docs/architecture-information.md)               | Arborescences, vocabulaire, statuts, navigation              |
| [Parcours utilisateur](docs/user-flows.md)                                      | Écrans et décisions de chaque tâche                          |
| [Parcours de vie](docs/user-journey.md)                                         | Personas, étapes, moments de vérité                          |
| [User stories](docs/user-stories.md)                                            | Besoins et critères d'acceptation, liés aux issues           |
| [Décisions d'architecture](docs/adr/)                                           | Un fichier par décision                                      |
| [`AGENTS.md`](AGENTS.md)                                                        | Règles du dépôt : stack, architecture, TDD, conventions      |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                                            | Cycle de travail, commits, revue, branches                   |

## Stack

| Couche          | Technologie                    | Emplacement          |
| --------------- | ------------------------------ | -------------------- |
| API             | NestJS 12 (ESM), Prisma 7      | `apps/api`           |
| Base de données | PostgreSQL, hébergé sur Neon   | -                    |
| Web             | Next.js 16 (App Router)        | `apps/web`           |
| Mobile          | Expo SDK 58 (Expo Router)      | `apps/mobile`        |
| Contrats        | Types partagés API et clients  | `packages/contracts` |
| Monorepo        | pnpm 12, Turborepo, Node.js 26 | racine               |

Les versions exactes font foi dans `pnpm-lock.yaml`. La politique de version (dernière version stable, sans CVE) est décrite dans [`AGENTS.md`](AGENTS.md).

## Démarrer

Prérequis : Node.js 26 (`nvm use`) et pnpm 12 (`npm install -g pnpm@12`).

```bash
git clone https://github.com/patrick26-Developer/mitemo.git
cd mitemo
pnpm install
```

`pnpm install` installe les dépendances et active les hooks Git.

Pour l'API, copier `apps/api/.env.example` en `apps/api/.env` et renseigner les URL PostgreSQL.

## Commandes

| Commande                 | Effet                                                       |
| ------------------------ | ----------------------------------------------------------- |
| `pnpm lint`              | ESLint sur tout le monorepo, zéro avertissement toléré      |
| `pnpm format:check`      | Vérification Prettier                                       |
| `pnpm typecheck`         | Vérification TypeScript de tous les paquets                 |
| `pnpm test`              | Tests unitaires                                             |
| `pnpm test:ci`           | Tests unitaires avec seuils de couverture                   |
| `pnpm test:e2e`          | Tests de bout en bout                                       |
| `pnpm build`             | Build de l'API, du web et des contrats                      |
| `pnpm audit:deps`        | Audit des dépendances (CVE de gravité modérée et plus)      |
| `pnpm --filter api test` | Commande limitée à une application (`api`, `web`, `mobile`) |

## Organisation du dépôt

```
apps/
  api/        NestJS : src/features/<feature>/{domain,application,infrastructure,presentation}
  web/        Next.js : src/app (routes), src/features/<feature>
  mobile/     Expo : app/ (routes), src/features/<feature>
packages/
  contracts/  types et contrats d'échange entre l'API et les clients
docs/         vision, cahier des charges, audit, ADR
scripts/      outillage du dépôt
```

Un dossier = une feature. Le détail des couches et des règles de dépendance est dans [`AGENTS.md`](AGENTS.md).

## Contribuer

- Le développement suit le TDD : le test est écrit avant le code.
- Les branches partent de `develop` et y reviennent par pull request. `staging` sert à la préproduction, `main` à la production.
- Les commits suivent Conventional Commits et sont atomiques. Ils ne portent aucune attribution à un outil d'IA.
- Toute pull request est assignée, revue, et verte en CI avant fusion.

Les règles complètes sont dans [`CONTRIBUTING.md`](CONTRIBUTING.md). Pour signaler une faille de sécurité, voir [`SECURITY.md`](SECURITY.md).
