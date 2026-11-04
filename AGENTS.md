# AGENTS.md — Mitemo

## Base de données

**PostgreSQL.** Raison : grand livre en partie double (montants en `BIGINT`, jamais de flottant), transactions `SERIALIZABLE` avec verrous explicites sur les écritures de solde. Détails dans [`docs/audit/03-architecture-technique.md`](docs/audit/03-architecture-technique.md).

**Neon convient**, surtout pour le pilote et le développement (branching de bases façon Git pour tester les migrations, autoscaling, offre gratuite généreuse). Deux points à respecter en production :
- Utiliser la **connexion directe (non poolée)** pour les écritures du grand livre — le *pooler* PgBouncer de Neon fonctionne en mode transaction et casse les verrous/`SET` de session nécessaires à `SERIALIZABLE`. La connexion poolée reste correcte pour les lectures simples.
- Pas de région africaine chez Neon (Frankfurt le plus proche) — même limite que tout autre fournisseur managé. Prévoir une copie de conformité en zone CEMAC avant la mise en production réelle (voir `docs/audit/04-infrastructure-services-budget.md`).

## Backend

NestJS + Prisma.

## Installation

Gestionnaire de paquets : **pnpm**.

```bash
# Dépendances d'exécution
pnpm add @nestjs/config @nestjs/jwt @nestjs/throttler @nestjs/schedule \
  @nestjs/event-emitter @nestjs/axios @nestjs/swagger @nestjs/terminus \
  @prisma/client class-validator class-transformer joi argon2 helmet \
  libphonenumber-js luxon firebase-admin nestjs-pino pino-http @sentry/nestjs

# Dépendances de développement
pnpm add -D prisma fast-check @faker-js/faker

# Initialisation Prisma (schéma + connexion à la base Neon ou locale)
pnpm dlx prisma init
```

## Mobile

