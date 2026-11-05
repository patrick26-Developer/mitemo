# AGENTS.md - Mitemo

Ce fichier fixe les règles du dépôt. Il s'applique à toute personne (ou tout outil) qui écrit du code ici. En cas de doute, la règle la plus stricte l'emporte.

## Règle d'or : des faits vérifiés, pas de mémoire

Tout agent (humain ou outil) qui travaille ici s'appuie sur des **données réelles et vérifiées**, jamais sur des souvenirs ou des suppositions.

- **Rechercher avant d'écrire.** Avant d'utiliser une API, une option de configuration ou une version de paquet, consulter la source officielle à jour : documentation du projet, registre npm (`pnpm view <paquet> version`), notes de version, code source. Une API qui « devrait exister » n'est pas une API qui existe.
- **Vérifier les versions installées**, pas celles qu'on croit connaître : `pnpm why <paquet>`, `package.json`, `pnpm-lock.yaml`.
- **Citer ses sources** dans la PR quand une décision repose sur une documentation externe (lien vers la page, la version ou l'avis de sécurité).
- **Ne jamais inventer** un résultat de test, une sortie de commande ou un chiffre. Si une vérification n'a pas pu être faite, le dire explicitement.
- **Données de test réalistes** : montants en XAF, numéros au format congolais valides (`libphonenumber-js`), dates en UTC. Générées par `@faker-js/faker` avec une graine fixe, jamais des valeurs fantaisistes qui masquent les cas limites.

## 1. Stack

| Couche          | Technologie                       | Version | Emplacement       |
| --------------- | --------------------------------- | ------- | ----------------- |
| API             | NestJS (ESM) + TypeScript         | 12      | `apps/api`        |
| ORM             | Prisma (+ `@prisma/adapter-pg`)   | 7       | `apps/api/prisma` |
| Base de données | PostgreSQL (hébergé sur Neon)     | -       | -                 |
| Web             | Next.js (App Router) + TypeScript | 16      | `apps/web`        |
| Mobile          | Expo (Expo Router) + TypeScript   | SDK 58  | `apps/mobile`     |
| Code partagé    | Contrats, types, utilitaires purs | -       | `packages/*`      |
| Monorepo        | pnpm workspaces + Turborepo       | 12 / 2  | racine            |
| Runtime         | Node.js (LTS active « Lithium »)  | 26      | `.nvmrc`          |
| Langage         | TypeScript                        | 6.0     | racine            |

Gestionnaire de paquets : **pnpm uniquement** (`npm` et `yarn` sont interdits). Version de Node : voir `.nvmrc`. Les versions exactes font foi dans `pnpm-lock.yaml`, pas dans ce tableau.

Points de version vérifiés à la mise en place (novembre 2026), à revérifier à chaque montée de version :

- **NestJS 12** : paquets ESM uniquement, l'API est donc en ESM (`"type": "module"`, imports relatifs en `.js`).
- **Prisma 7** : générateur `prisma-client` avec `output` obligatoire (client généré dans `apps/api/src/generated/`, non versionné), URL de connexion dans `prisma.config.ts` et non plus dans le schéma, adaptateur `@prisma/adapter-pg` obligatoire. Le dist-tag `latest` de `prisma` a pointé sur une RC : toujours épingler une version stable.
- **Expo SDK 58** : impose React 19.3.0 et React Native 0.88.1 ; le web s'aligne sur la même version de React. Toujours ajouter une dépendance native avec `pnpm exec expo install`, jamais avec `pnpm add`.
- **TypeScript 6.0** : typescript-eslint ne supporte pas encore TypeScript 7.
- **Node.js 26** : LTS active depuis le 28 octobre 2026 (Node 24 est passé en maintenance le 20 octobre 2026). Source : calendrier officiel `github.com/nodejs/Release`. On suit toujours la LTS **active**.
- **pnpm 12** : ne lit plus que l'authentification et le registre dans `.npmrc` (tous les réglages sont dans `pnpm-workspace.yaml`), refuse tout réglage inconnu, et applique par défaut une quarantaine `minimumReleaseAge` : une version publiée depuis moins de 24 heures est refusée.

**Politique de version** : chaque dépendance est à sa **dernière version stable**, sans CVE, sauf contrainte documentée ici ou dans `pnpm-workspace.yaml` (React fixé par Expo, TypeScript par typescript-eslint). Jamais de RC, alpha ou beta. Une version encore en quarantaine se remplace par la précédente ; on ne crée **jamais** d'exception `minimumReleaseAgeExclude` (pnpm peut en ajouter une de lui-même : la retirer).

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
│   └── contracts/           types et contrats d'échange API <-> clients
├── docs/
│   ├── adr/                 décisions d'architecture (une décision = un fichier)
│   └── audit/
├── scripts/                 outillage du dépôt
├── eslint.config.mjs        configuration ESLint unique (blocs ciblés par application)
├── tsconfig.base.json       options TypeScript strictes héritées partout
└── pnpm-workspace.yaml      workspaces, scripts d'installation autorisés, overrides de sécurité
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

| Type             | Suffixe              | Outil                       | Portée                                  |
| ---------------- | -------------------- | --------------------------- | --------------------------------------- |
| Unitaire API     | `*.spec.ts`          | Vitest (+ SWC)              | domain, application, presentation       |
| Unitaire web     | `*.spec.tsx`         | Vitest + Testing Library    | composants, hooks, model                |
| Unitaire mobile  | `*.spec.tsx`         | Jest (`jest-expo`) + RNTL   | composants, hooks, model                |
| Unitaire paquets | `*.spec.ts`          | `node:test`                 | `packages/*` (TypeScript natif de Node) |
| Intégration      | `*.int-spec.ts`      | Vitest + PostgreSQL de test | adaptateurs Prisma, transactions        |
| E2E API          | `test/*.e2e-spec.ts` | Vitest + Supertest          | endpoints HTTP                          |
| E2E web          | `e2e/*.spec.ts`      | Playwright                  | parcours utilisateur critiques          |
| E2E mobile       | `.maestro/*.yaml`    | Maestro                     | parcours utilisateur critiques          |

Pourquoi trois outils : chacun est le choix par défaut officiel de sa plateforme (Vitest pour un projet NestJS ESM et dans le guide Next.js, `jest-expo` pour Expo). Ne pas les unifier de force.

Sur le mobile, les tests ne vont **jamais** dans `app/` : Expo Router transformerait chaque fichier en route. L'écran vit dans `src/features/<feature>/components/` et `app/` ne fait que le monter.

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

- **Une fonction = un traitement.** Si son nom contient « et », elle est à découper. Pas de fonction à logique longue : 20 lignes, 10 instructions, 3 paramètres (au-delà, un objet typé), 3 niveaux d'imbrication et une complexité cyclomatique de 8 au maximum. Ces limites sont imposées par ESLint.
- **Une classe = une intention.** Un cas d'usage = une classe avec une seule méthode publique `execute()`.
- **Un dossier = une feature.** Pas de dossiers techniques globaux du type `controllers/`, `services/`, `utils/` à la racine de `src`.
- **Un fichier = un concept exporté.**

### 3.5 Nommage

- Fichiers en `kebab-case` avec suffixe de rôle : `.entity.ts`, `.value-object.ts`, `.use-case.ts`, `.repository.ts`, `.controller.ts`, `.dto.ts`, `.module.ts`.
- Classes en `PascalCase`, fonctions et variables en `camelCase`, constantes en `UPPER_SNAKE_CASE`.
- Code et noms techniques en anglais. Documentation, messages de revue et textes produit en français.

### 3.6 Composants (web et mobile)

Un composant affiche, il ne calcule pas.

- **Pas de composant à logique longue** : 40 lignes au maximum par composant. La logique (calculs, formatage, règles) vit dans `model/` et est testée sans rendu ; l'état et les effets vivent dans un hook de `hooks/`.
- **Pas de `.map()` imbriqué dans le JSX.** Dès qu'une liste contient une autre liste, l'élément de liste devient un composant dédié (`GroupList` rend des `GroupItem`, qui rend des `MemberBadge`). Règle ESLint bloquante.
- **Pas de ternaire imbriqué** dans le rendu : utiliser un retour anticipé ou un sous-composant.
- **Composants de présentation purs** : ils reçoivent des props et émettent des événements. Aucun appel réseau, aucun accès direct au stockage.
- **Props explicites et typées**, cinq au maximum. Au-delà, le composant fait trop de choses ou doit recevoir un objet métier.
- **Réutilisable avant d'être spécifique** : avant de créer un composant, chercher dans `shared/` et dans les autres features. Un composant utilisé par deux features remonte dans `shared/`.
- **Testable par construction** : chaque composant a son `*.spec.tsx` (Testing Library). On teste ce que voit l'utilisateur (textes, rôles, actions), pas l'implémentation.
- **Accessibilité** : rôles et libellés renseignés, ce qui sert aussi de sélecteurs dans les tests.

#### Audit de structure des composants

À chaque PR qui touche `components/`, le relecteur (et l'agent avant de soumettre) vérifie :

- [ ] un composant par fichier, nommé comme le fichier ;
- [ ] aucune logique métier dans le composant (elle est dans `model/` ou un hook) ;
- [ ] aucune liste imbriquée rendue inline ;
- [ ] pas de duplication avec un composant existant de `shared/` ;
- [ ] la feature n'expose ses composants que par son `index.ts` ;
- [ ] les tests couvrent les états vide, chargement, erreur et nominal.

### 3.7 Commentaires : JSDoc uniquement

- Toute fonction, classe, méthode et composant **exporté** porte un bloc JSDoc (`/** ... */`) avec une description, et `@param`, `@returns`, `@throws` quand c'est pertinent. Imposé par `eslint-plugin-jsdoc`.
- En TypeScript, les types restent dans la signature, pas dans le JSDoc. Le JSDoc explique l'intention et les règles métier.
- Le commentaire explique **pourquoi**, pas **quoi**. Si le code a besoin d'un commentaire pour être compris, on le renomme ou on le découpe d'abord.
- Pas de code commenté, pas de `TODO` sans numéro d'issue (`TODO(#42): ...`).

```ts
/**
 * Enregistre la cotisation d'un membre et met à jour le solde du groupe
 * dans une même transaction SERIALIZABLE.
 * @throws {ContributionAlreadyRecordedError} si la période est déjà réglée.
 */
export class RecordContributionUseCase {
```

### 3.8 Zéro erreur, zéro avertissement

- Aucune erreur et aucun avertissement tolérés : ESLint tourne en `--max-warnings=0`, TypeScript en mode strict, les tests doivent tous passer.
- Pas de `eslint-disable` sans justification sur la même ligne et validation en revue.
- Aucun test ignoré (`.skip`, `.only`) n'est fusionné.
- Une erreur à l'exécution est traitée explicitement : erreur métier typée, ou remontée volontaire avec contexte. Jamais de `catch` vide.

### 3.9 Types et interfaces partagés

Un type qui traverse le réseau est défini **une seule fois**, dans `packages/contracts` (`@mitemo/contracts`), et importé par l'API, le web et le mobile. Il n'est jamais redéclaré dans une application.

**Où vit un type :**

| Le type décrit...                                       | Emplacement                              |
| ------------------------------------------------------- | ---------------------------------------- |
| un échange HTTP (requête, réponse, erreur, montant, ID) | `packages/contracts`                     |
| une règle métier (entité, value object, port)           | `apps/api/src/features/<feature>/domain` |
| des props de composant, un état d'écran                 | le fichier du composant ou du hook       |
| un type utilisé par deux features d'une même app        | `src/shared/` de cette app               |

Les entités du domaine ne sont **jamais** exposées telles quelles aux clients : la couche `presentation` les convertit en contrat.

**Règles d'écriture (imposées par ESLint et TypeScript) :**

- `interface` pour une forme d'objet ou un port ; `type` pour une union, un alias ou un type dérivé.
- Pas de préfixe `I`, pas de suffixe `Type`. Suffixes de rôle : `XxxRequest`, `XxxResponse`, `XxxDto`, `XxxRepository`, `XxxProps`.
- Pas d'`enum` : un tableau `as const` et l'union dérivée (`(typeof CURRENCIES)[number]`), utilisables à la fois comme valeurs et comme types.
- Identifiants et montants **nominaux** avec `Brand` : un `GroupId` ne peut pas être passé là où un `MemberId` est attendu, un `bigint` brut n'est pas un `AmountMinor`.
- Propriétés `readonly` et `readonly T[]` par défaut dans les contrats.
- Formats JSON fixés : montant en chaîne d'entier (`SerializedAmount`), date en chaîne ISO 8601 UTC, identifiant en UUID.
- `import type` / `export type` pour tout ce qui n'est qu'un type.
- Import par la racine du paquet uniquement (`@mitemo/contracts`), jamais `@mitemo/contracts/src/...`.
- `unknown` plutôt que `any` pour une donnée externe, puis validation à la frontière.
- Chaque type et chaque champ non évident a son JSDoc, **unité comprise** (« en plus petite unité de la devise », « en UTC »).

**Évolution d'un contrat :**

- Ajouter un champ optionnel ou un code d'erreur : PR normale, mais les clients le gèrent dans la même PR.
- Renommer, supprimer ou changer le type d'un champ : changement cassant. Commit `feat(contracts)!:`, mise à jour de l'API et des deux clients dans la même PR, et note dans la description.
- Le paquet a ses propres tests, y compris des tests de types (`// @ts-expect-error <raison>`) qui garantissent qu'un mauvais usage ne compile pas.

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

### 5.1 Audit des dépendances (CVE)

- **Avant d'ajouter un paquet**, vérifier sur des sources réelles : dernière version publiée, date de dernière publication, mainteneurs actifs, licence compatible, avis de sécurité ouverts ([GitHub Advisory Database](https://github.com/advisories), `pnpm audit`). Préférer une dépendance déjà présente ou la bibliothèque standard.
- `pnpm audit:deps` (niveau `moderate` et plus) doit être vert. Il tourne au `pre-push`, dans la CI sur chaque PR, et chaque lundi par le workflow `audit.yml`.
- Une faille sur une dépendance transitive se corrige par mise à jour du parent, sinon par un `overrides` dans `pnpm-workspace.yaml`, **avec la référence de l'avis** (GHSA ou CVE) en commentaire. L'override est retiré dès que le parent publie le correctif.
- Une faille qu'on ne peut pas corriger tout de suite fait l'objet d'une issue avec l'avis, l'impact réel sur Mitemo et la date de réexamen. Elle n'est jamais ignorée en silence.
- Les mises à jour Dependabot sont relues comme du code : lire les notes de version avant de fusionner.
- **Scripts d'installation** : pnpm les bloque par défaut. `allowBuilds` dans `pnpm-workspace.yaml` liste chaque paquet concerné : `true` autorisé, `false` refusé en connaissance de cause. Un paquet absent de la liste fait échouer l'installation. Tout ajout se justifie en PR.
- **Écarts de pairs** : un avertissement de dépendance pair se corrige (bonne version) ou s'accepte explicitement dans `peerDependencyRules` avec la raison et la source. Jamais ignoré.

## 6. Collaboration

Le détail est dans [`CONTRIBUTING.md`](CONTRIBUTING.md). L'essentiel :

- Aucun push direct sur `main`. Tout passe par une pull request revue et verte en CI.
- **Toute pull request est assignée** à la personne qui en répond (l'auteur par défaut, assigné automatiquement à l'ouverture). Une PR sans assignation ne peut pas être fusionnée : le statut `Assignation` est obligatoire.
- Branches : `type/numero-description-courte` (exemple : `feat/42-enregistrer-cotisation`).
- Commits au format **Conventional Commits**, vérifiés par `commitlint`.
- **Commits atomiques** : un commit = un changement cohérent et testable.
- **Aucune attribution à un outil d'IA** : pas de trailer `Co-authored-by` vers une adresse d'assistant, pas de mention « Generated with ». Le hook `commit-msg` et la CI rejettent ces commits. L'auteur d'un commit est la personne qui en répond.

## 7. Hooks Git et CI

| Moment         | Ce qui tourne                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit`   | lint-staged (ESLint + Prettier sur les fichiers indexés), puis typecheck et tests des paquets modifiés                                         |
| `commit-msg`   | commitlint + refus des attributions IA                                                                                                         |
| `pre-push`     | audit des dépendances, lint, typecheck et tests de tout le monorepo                                                                            |
| GitHub Actions | install figée, audit des dépendances, format, lint, typecheck, tests avec couverture, build, vérification de chaque message de commit de la PR |
| Chaque lundi   | `audit.yml` : audit des dépendances, même sans changement de code                                                                              |

Contourner un hook (`--no-verify`) est interdit. Si un hook bloque à tort, on corrige le hook dans une PR.

## 8. Commandes

```bash
pnpm install                 # installe tout et active les hooks Git
pnpm lint                    # ESLint sur tout le monorepo (zéro avertissement)
pnpm audit:deps              # audit CVE des dépendances
pnpm format:check            # vérification Prettier
pnpm typecheck               # tsc --noEmit partout
pnpm test                    # tous les tests unitaires
pnpm test:e2e                # tests de bout en bout
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
- [ ] lint, format et typecheck passent sans erreur ni avertissement ;
- [ ] `pnpm audit:deps` est vert, et toute nouvelle dépendance a été vérifiée (version, maintenance, licence, avis) ;
- [ ] l'audit de structure des composants est fait (si l'interface est touchée) ;
- [ ] tout élément exporté a son JSDoc ;
- [ ] les règles de dépendance entre couches sont respectées ;
- [ ] la documentation (README de feature, ADR, `.env.example`) est à jour ;
- [ ] la PR a été approuvée par au moins un autre membre de l'équipe.
