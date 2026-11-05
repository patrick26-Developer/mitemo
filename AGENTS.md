# AGENTS.md - Mitemo

Ce fichier fixe les règles du dépôt. Il s'applique à toute personne (ou tout outil) qui écrit du code ici. En cas de doute, la règle la plus stricte l'emporte.

## 1. Stack

| Couche          | Technologie                       | Emplacement       |
| --------------- | --------------------------------- | ----------------- |
| API             | NestJS + TypeScript               | `apps/api`        |
| ORM             | Prisma                            | `apps/api/prisma` |
| Base de données | PostgreSQL (hébergé sur Neon)     | -                 |
| Web             | Next.js (App Router) + TypeScript | `apps/web`        |
| Mobile          | Expo (Expo Router) + TypeScript   | `apps/mobile`     |
| Code partagé    | Contrats, types, utilitaires purs | `packages/*`      |
| Monorepo        | pnpm workspaces + Turborepo       | racine            |

Gestionnaire de paquets : **pnpm uniquement** (`npm` et `yarn` sont interdits). Version de Node : voir `.nvmrc`.

### 1.1 PostgreSQL et Neon

- Grand livre en partie double : montants en `BIGINT` (centimes / plus petite unité), **jamais de flottant**, ni en base ni en TypeScript (`bigint` côté code, sérialisé en chaîne dans le JSON).
- Écritures de solde en transaction `SERIALIZABLE` avec verrous explicites. Détails : [`docs/audit/03-architecture-technique.md`](docs/audit/03-architecture-technique.md).
- Neon convient pour le développement et le pilote (branching de bases pour tester les migrations, autoscaling).
- Deux URL de connexion :
  - `DATABASE_URL` : connexion **directe (non poolée)**, utilisée pour les écritures du grand livre et pour `prisma migrate`. Le pooler PgBouncer de Neon fonctionne en mode transaction et casse les verrous et les `SET` de session.
  - `DATABASE_POOLED_URL` : connexion poolée, réservée aux lectures simples.
- Pas de région africaine chez Neon (Frankfurt est la plus proche). Prévoir une copie de conformité en zone CEMAC avant la production réelle (voir [`docs/audit/04-infrastructure-services-budget.md`](docs/audit/04-infrastructure-services-budget.md)).
- Chaque migration Prisma est testée sur une branche Neon dédiée avant fusion. Une migration fusionnée n'est jamais modifiée : on en écrit une nouvelle.

## 2. Arborescence

```
mitemo/
├── apps/
│   ├── api/                 NestJS
│   │   ├── prisma/          schema.prisma, migrations/, seed.ts
│   │   ├── src/
│   │   │   ├── features/    un dossier = une feature
│   │   │   ├── shared/      briques transverses sans logique métier
│   │   │   └── main.ts
│   │   └── test/            tests e2e (Supertest)
│   ├── web/                 Next.js
│   │   └── src/
│   │       ├── app/         routes uniquement (fines, sans logique)
│   │       ├── features/    un dossier = une feature
│   │       └── shared/      UI de base, hooks génériques
│   └── mobile/              Expo
│       ├── app/             routes Expo Router uniquement
│       └── src/
│           ├── features/
│           └── shared/
├── packages/
│   ├── contracts/           schémas d'échange API <-> clients (types + validation)
│   ├── eslint-config/       configuration ESLint partagée
│   └── tsconfig/            configurations TypeScript partagées
├── docs/
│   ├── adr/                 décisions d'architecture (une décision = un fichier)
│   └── audit/
└── scripts/                 outillage du dépôt
```

### 2.1 Une feature côté API

```
apps/api/src/features/contributions/
├── domain/
│   ├── contribution.entity.ts
│   ├── contribution.entity.spec.ts
│   ├── amount.value-object.ts
│   ├── amount.value-object.spec.ts
│   └── contribution.repository.ts        port (interface), aucune dépendance à Prisma
├── application/
│   ├── record-contribution.use-case.ts
│   └── record-contribution.use-case.spec.ts
├── infrastructure/
│   ├── prisma-contribution.repository.ts adaptateur du port
│   └── prisma-contribution.repository.int-spec.ts
├── presentation/
│   ├── contributions.controller.ts
│   ├── contributions.controller.spec.ts
│   └── record-contribution.dto.ts
└── contributions.module.ts
```

Règles de dépendance (vérifiées en revue et par lint) :

- `domain` ne dépend de rien d'autre que de lui-même. Pas de NestJS, pas de Prisma.
- `application` dépend de `domain` uniquement (via les ports).
- `infrastructure` implémente les ports de `domain`.
- `presentation` appelle `application`, jamais `infrastructure` directement.
- Une feature n'importe pas les fichiers internes d'une autre feature. Elle passe par ce que l'autre module exporte, ou par un événement.

### 2.2 Une feature côté web et mobile

```
src/features/contributions/
├── components/      composants de présentation, sans appel réseau
├── hooks/           état et effets
├── api/             appels HTTP vers l'API (typés par packages/contracts)
├── model/           logique pure de la feature
└── index.ts         seule porte d'entrée publique de la feature
```

Les fichiers de route (`app/`) se limitent à assembler des composants de features.

## 3. Principes de conception

### 3.1 TDD obligatoire

Cycle **rouge, vert, refactor**, sans exception pour le code métier :

1. Écrire un test qui échoue et décrit le comportement attendu.
2. Écrire le code minimal pour le faire passer.
3. Refactorer en gardant les tests verts.

Conséquences pratiques :

- Aucun code de production sans test qui le justifie.
- Une correction de bug commence par un test qui reproduit le bug.
- Les tests sont colocalisés : `x.ts` et `x.spec.ts` dans le même dossier.
- Tests de propriétés (`fast-check`) pour tout calcul monétaire et toute règle d'équilibre du grand livre.
- Un test ne dépend ni de l'heure système, ni du réseau, ni de l'ordre d'exécution. L'horloge est injectée.

| Type        | Suffixe              | Outil                     | Portée                                 |
| ----------- | -------------------- | ------------------------- | -------------------------------------- |
| Unitaire    | `*.spec.ts(x)`       | Jest                      | domain, application, composants, hooks |
| Intégration | `*.int-spec.ts`      | Jest + PostgreSQL de test | adaptateurs Prisma, transactions       |
| E2E API     | `test/*.e2e-spec.ts` | Jest + Supertest          | endpoints HTTP                         |
| E2E web     | `e2e/*.spec.ts`      | Playwright                | parcours utilisateur critiques         |
| E2E mobile  | `.maestro/*.yaml`    | Maestro                   | parcours utilisateur critiques         |

Couverture minimale exigée en CI : **90 %** sur `domain` et `application`, **80 %** sur le reste.

### 3.2 SOLID

- **S** : une classe a une seule raison de changer.
- **O** : on étend par ajout (nouvelle stratégie, nouvel adaptateur), pas par modification d'un `switch` existant.
- **L** : une implémentation de port respecte tout le contrat du port, y compris les erreurs.
- **I** : des ports petits et ciblés plutôt qu'un gros dépôt générique.
- **D** : le métier dépend d'abstractions. Les implémentations sont injectées par le module NestJS.

### 3.3 KISS et YAGNI

- La solution la plus simple qui passe les tests.
- Pas d'abstraction tant qu'il n'existe pas un deuxième cas réel.
- Pas de code « pour plus tard ». Pas de code commenté.

### 3.4 Règles de granularité

- **Une fonction = un traitement.** Si son nom contient « et », elle est à découper. Repère : 20 lignes, 3 paramètres au maximum (au-delà, un objet typé).
- **Une classe = une intention.** Un cas d'usage = une classe avec une seule méthode publique `execute()`.
- **Un dossier = une feature.** Pas de dossiers techniques globaux du type `controllers/`, `services/`, `utils/` à la racine de `src`.
- **Un fichier = un concept exporté.**

### 3.5 Nommage

- Fichiers en `kebab-case` avec suffixe de rôle : `.entity.ts`, `.value-object.ts`, `.use-case.ts`, `.repository.ts`, `.controller.ts`, `.dto.ts`, `.module.ts`.
- Classes en `PascalCase`, fonctions et variables en `camelCase`, constantes en `UPPER_SNAKE_CASE`.
- Code et noms techniques en anglais. Documentation, messages de revue et textes produit en français.

## 4. TypeScript strict

- `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride` (voir `tsconfig.base.json`).
- Interdits : `any`, `@ts-ignore`, assertions non nulles `!`, `console.log` en code de production.
- `@ts-expect-error` toléré uniquement avec une explication sur la même ligne.
- Les erreurs métier sont des classes typées, jamais des chaînes.
- Toute entrée externe (HTTP, variables d'environnement, webhooks) est validée à la frontière.

## 5. Sécurité et données

- Aucun secret dans le dépôt. Les variables attendues sont listées dans `.env.example` de chaque application.
- Mots de passe et codes : `argon2`. Numéros de téléphone : `libphonenumber-js`. Dates : `luxon`, toujours en UTC en base.
- Les logs ne contiennent ni numéro complet, ni jeton, ni montant associé à une identité.

## 6. Collaboration

Le détail est dans [`CONTRIBUTING.md`](CONTRIBUTING.md). L'essentiel :

- Aucun push direct sur `main`. Tout passe par une pull request revue et verte en CI.
- Branches : `type/numero-description-courte` (exemple : `feat/42-enregistrer-cotisation`).
- Commits au format **Conventional Commits**, vérifiés par `commitlint`.
- **Commits atomiques** : un commit = un changement cohérent et testable.
- **Aucune attribution à un outil d'IA** : pas de trailer `Co-authored-by` vers une adresse d'assistant, pas de mention « Generated with ». Le hook `commit-msg` et la CI rejettent ces commits. L'auteur d'un commit est la personne qui en répond.

## 7. Hooks Git et CI

| Moment         | Ce qui tourne                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pre-commit`   | lint-staged (ESLint + Prettier sur les fichiers indexés), puis typecheck et tests des paquets modifiés                  |
| `commit-msg`   | commitlint + refus des attributions IA                                                                                  |
| `pre-push`     | lint, typecheck et tests de tout le monorepo                                                                            |
| GitHub Actions | install figée, lint, format, typecheck, tests avec couverture, build, vérification de chaque message de commit de la PR |

Contourner un hook (`--no-verify`) est interdit. Si un hook bloque à tort, on corrige le hook dans une PR.

## 8. Commandes

```bash
pnpm install                 # installe tout et active les hooks Git
pnpm lint                    # ESLint sur tout le monorepo
pnpm format:check            # vérification Prettier
pnpm typecheck               # tsc --noEmit partout
pnpm test                    # tous les tests
pnpm build                   # build de toutes les applications
pnpm --filter api test       # tests d'une seule application
```

### 8.1 Dépendances prévues pour l'API

```bash
pnpm --filter api add @nestjs/config @nestjs/jwt @nestjs/throttler @nestjs/schedule \
  @nestjs/event-emitter @nestjs/axios @nestjs/swagger @nestjs/terminus \
  @prisma/client class-validator class-transformer joi argon2 helmet \
  libphonenumber-js luxon firebase-admin nestjs-pino pino-http @sentry/nestjs

pnpm --filter api add -D prisma fast-check @faker-js/faker supertest @types/supertest
```

## 9. Définition de « terminé »

Une tâche est terminée quand :

- [ ] les tests ont été écrits avant le code et passent ;
- [ ] la couverture minimale est respectée ;
- [ ] lint, format et typecheck passent ;
- [ ] les règles de dépendance entre couches sont respectées ;
- [ ] la documentation (README de feature, ADR, `.env.example`) est à jour ;
- [ ] la PR a été approuvée par au moins un autre membre de l'équipe.
