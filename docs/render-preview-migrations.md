# Migrations Render et Neon Preview

Le script cible uniquement le compute ep-frosty-tree-be1lox57 de la branche br-solitary-mud-benm5t51, base neondb. Vérifier l’association compute-branche dans Neon et relever l’hôte direct exact. Prévoir une vérification de la date d’expiration avant la présentation. Si Neon remplace le compute, faire revoir la nouvelle cible dans le code.

Paramètres requis : DATABASE_URL directe avec sslmode=verify-full, MITEMO_PREVIEW_DB_HOST, MITEMO_PREVIEW_DB_NAME=neondb, MITEMO_DEPLOYMENT=preview, MITEMO_DEMO_AUTH=true et MITEMO_PREVIEW_KEY (32 caractères au minimum). Ne jamais publier les valeurs secrètes.

Depuis la racine du SHA autorisé, installer les dépendances, puis exécuter pnpm --filter @mitemo/contracts build et pnpm --filter api build. Le build de l’API génère déjà le client Prisma. Après validation de la cible et autorisation de migration, la commande est :

```sh
node apps/api/dist/shared/database/preview-migrate.js
```

Sur Render Free, laisser Pre-Deploy vide et exécuter la commande depuis un environnement opérateur avec les variables Preview injectées, avant le déploiement manuel du même SHA. Si le service dispose déjà d’une offre qui prend en charge Pre-Deploy, cette commande peut y être configurée après accord. Le script n’affiche pas la sortie brute de Prisma.

Avant toute fusion dans develop, désactiver Auto-Deploy dans Render si l’autorisation de déploiement est encore en attente. Après revue, fusionner #105 puis #106 et la PR de migration. Vérifier le SHA et les six migrations avec pnpm --filter api exec prisma migrate status, après vérification indépendante de la cible. Appliquer uniquement les migrations manquantes. Garder le Start actuel et /health. Après déploiement, vérifier SHA Live, /health, Swagger avec et sans accès, connexion et sessions, portefeuille, historique, objectifs, calendrier, isolation et persistance après redémarrage.

Source : https://render.com/docs/deploys#pre-deploy-command
