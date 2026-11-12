# Prévisualisation P0 sur Render

Web Service Node, Frankfurt, Free. Déployer depuis `develop` après intégration de la PR. Garder Root Directory et Pre-Deploy Command vides, Auto-Deploy sur Off et Health Check Path sur `/health`.

## Build Command

```sh
export PNPM_HOME="$HOME/.local/share/pnpm" && export PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH" && curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=12.16.1 SHELL=/bin/bash sh - && HUSKY=0 pnpm install --frozen-lockfile --prod=false && pnpm --filter @mitemo/contracts build && pnpm --filter api build
```

## Start Command

```sh
cd apps/api && node --env-file-if-exists=.env dist/main.js
```

| Variable | Configuration |
| --- | --- |
| NODE_VERSION | `26.13.0` |
| NODE_ENV | `production` |
| SKIP_INSTALL_DEPS | `true` |
| DATABASE_URL | Secret. URL directe de Neon Preview avec `sslmode=verify-full`. |
| MITEMO_PREVIEW_DB_HOST | Hôte direct relevé sur la branche Neon Preview, sans identifiants ni port. |
| MITEMO_PREVIEW_DB_NAME | Base sélectionnée sur cette branche, par exemple `neondb`. |
| MITEMO_DEPLOYMENT | `preview` |
| MITEMO_DEMO_AUTH | `true` |
| MITEMO_PREVIEW_KEY | Secret. Générer une valeur aléatoire de 32 octets et la conserver dans Render. |
| PORT | Fourni par Render. |

Toutes les routes d’identité exigent l’en-tête `X-Mitemo-Preview-Key`. Distribuer le secret aux seuls testeurs via un canal privé. La clé ne doit figurer ni dans Git ni dans un bundle Expo. Le profil et la gestion des sessions exigent aussi le jeton de session. Render fournit les variables `RENDER` et `RENDER_SERVICE_NAME`. Le service doit s’appeler exactement `mitemo-api-dev` et la cible PostgreSQL doit correspondre à l’endpoint et à la base autorisés. Les comptes préexistants et les comptes sans marqueur de démonstration sont exclus du parcours simulé. Swagger reste disponible en local. Le mode production conserve le parcours simulé désactivé lorsque `MITEMO_DEPLOYMENT` est absent ou vaut `production`.

Dans la console Neon, sélectionner la branche Preview du projet MITEMO et relever son identifiant de branche et son endpoint de lecture-écriture direct dans les détails de connexion. Vérifier que cet endpoint est distinct de celui de production. Reporter l’hôte direct dans `MITEMO_PREVIEW_DB_HOST` et le nom de la base dans `MITEMO_PREVIEW_DB_NAME`. Renseigner séparément `DATABASE_URL` avec l’URL directe de cette branche, sans `-pooler`, avec `sslmode=verify-full`. Conserver `channel_binding=require` si Neon le fournit. Le PostgreSQL local dédié reste accessible sur loopback avec la base `mitemo_preview`.

## Migration de la base distante

Après autorisation de création de la base, réserver une base et un rôle à la prévisualisation, avec TLS sur l’accès externe. Utiliser un environnement de livraison qui accède à son URL directe. Contrôler le fournisseur, l’hôte et le nom de la base avant toute écriture. Utiliser le SHA exact du déploiement. Après autorisation de migration, exécuter depuis la racine, avec `DATABASE_URL` injectée comme secret, `MITEMO_DEPLOYMENT=preview` et les deux variables d’identité. Prisma vérifie la cible avant toute connexion.

```sh
pnpm --filter api exec prisma migrate status
pnpm --filter api exec prisma migrate deploy
pnpm --filter api exec prisma migrate status
```

Un statut initial signalant des migrations en attente est attendu sur une base neuve. Vérifier ensuite que le grand livre et l’identité figurent dans `_prisma_migrations`, puis demander l’autorisation de déclencher le déploiement manuel. Vérifier `GET /health` et les réponses 401 des routes OTP sans clé avant d’inviter Espoir.

Sources officielles. [Render Deploys](https://render.com/docs/deploys), [pnpm Installation](https://pnpm.io/installation), [Prisma migrate deploy](https://www.prisma.io/docs/cli/v7/migrate/deploy).
