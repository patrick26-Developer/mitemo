# Dépendances externes Mitemo

État relevé le 12 novembre 2026 dans le worktree `integration-mobile`.
Les versions installées et `pnpm-lock.yaml` font foi. Aucun secret ne figure ici.

## Services et responsables

| Dépendance | Nécessité | Usage et secours | Responsable |
| --- | --- | --- | --- |
| PostgreSQL local | Obligatoire en développement | `mitemo_dev` pour développement/démonstration ; `mitemo_test` isolée pour tests. Ne jamais lancer les tests d'écriture sur `mitemo_dev`. | Patrick, opérateur local |
| Neon Preview | Obligatoire pour API distante | Projet `mitemo`, branche autorisée `br-solitary-mud-benm5t51`, base `neondb`. Association compute/branche et migrations à vérifier dans la console avant toute écriture. Secours : PostgreSQL local. | Patrick, propriétaire à confirmer dans Neon |
| Render | Obligatoire pour API HTTPS distante | Service `mitemo-api-dev`, branche `develop`. SHA Live et Auto-Deploy à relever. Migration et déploiement nécessitent chacun une autorisation. Secours : API locale accessible sur le LAN. | Patrick, accès console requis |
| GitHub | Obligatoire pour livraison revue | Dépôt `patrick26-Developer/mitemo`, PR et CI ; travail local possible sans réseau après installation. | Patrick ; revue mobile Espoir |
| Expo/EAS | Facultatif pour Metro local, nécessaire pour builds cloud | Compte Patrick `patrick_degrace`. Projet partagé et compte d'Espoir non confirmés. Ne pas créer de doublon avant sa réponse. | Patrick et Espoir |
| Apple Developer | Obligatoire pour build cloud sur iPhone physique | Disponibilité du compte non confirmée. Expo Go à essayer si SDK/modules compatibles ; ce n'est pas une validation iPhone. | Espoir, propriétaire à confirmer |
| Registre npm / audit | Obligatoire pour installation et contrôle CVE | pnpm uniquement ; cache local permet installation hors ligne si complet. Avis faible deepmerge sans correctif, suivi dans les issues #45 et #118. | Responsable de PR |
| Expo Push | Facultatif pour parcours prioritaire | Enregistrement du jeton via API ; réception Android nécessite un development build, pas Expo Go. | Espoir pour mobile, Patrick pour API |
| PawaPay Sandbox | Facultatif, hors parcours prioritaire | Réception signée et idempotente uniquement ; aucun crédit comptable sur HTTP 200. Aucun paiement réel ni jeton créé par cette livraison. | Patrick, accès marchand à confirmer |
| SMS / OTP externe | Non utilisé actuellement | OTP serveur simulé de six chiffres, explicitement affiché en démonstration. Intégration SMS réelle après stabilisation. | Responsable backend |

## Versions exactes principales

Versions vérifiées dans les paquets installés ; aucune dépendance ajoutée par cette intégration.

| Composant | Version |
| --- | --- |
| Node.js / pnpm | 26.13.0 / 12.16.1 |
| TypeScript / Turborepo | 6.0.3 / 2.11.10 |
| NestJS common, core, platform-express | 12.3.3 |
| Swagger NestJS | 12.1.1 |
| Prisma, client, adapter-pg | 7.10.1 |
| Driver pg / argon2 | 8.23.1 / 0.45.2 |
| libphonenumber-js | 1.13.15 |
| Expo / React / React Native | 58.0.23 / 19.3.0 / 0.88.1 |
| Zustand / Zod | 5.1.0 / 4.6.7 |
| Vitest / Jest / React Native Testing Library | 5.1.0 / 30.5.2 / 14.1.0 |
| ESLint / Prettier | 10.14.0 / 3.9.10 |
| Next.js (web, hors parcours prioritaire) | 16.4.5 |

Version serveur PostgreSQL : à relever par `SELECT version()` ; ne pas déduire sa version du driver.

## Configuration sans secrets

| Variable | Environnement | Obligation / règle |
| --- | --- | --- |
| `DATABASE_URL` | API et migrations | Connexion directe. Local : `localhost/mitemo_dev` ; tests : `localhost/mitemo_test`. Neon Preview : hôte sans `-pooler`, base `neondb`, TLS `sslmode=verify-full`. Ne jamais remplacer le fichier local par une URL Neon. |
| `DATABASE_POOLED_URL` | API | Réservée aux lectures simples ; non utilisée pour migrations ou grand livre. Vérifier que les deux hôtes appartiennent à la même branche. |
| `PORT` | API | 3000 par défaut ; Render fournit son port. |
| `MITEMO_DEMO_AUTH` | API | `true` uniquement pour démonstration explicitement activée. |
| `MITEMO_DEPLOYMENT` | API distante | `preview` ; absente pour démonstration locale. |
| `MITEMO_PREVIEW_KEY` | Serveur seulement | Secret d'au moins 32 caractères, jamais dans Expo, logs, Git ou bundle. |
| `MITEMO_PREVIEW_DB_HOST`, `MITEMO_PREVIEW_DB_NAME` | API Preview | Hôte direct et base relevés indépendamment dans la console Neon. |
| `NODE_ENV`, `RENDER`, `RENDER_SERVICE_NAME` | Hébergeur | Les contrôles Preview exigent le service dédié `mitemo-api-dev`. Ne pas contourner les gardes pour faire fonctionner une mauvaise cible. |
| `EXPO_PUBLIC_API_URL` | Mobile | `https://mitemo-api-dev.onrender.com` ; compilation Expo par accès direct `process.env.EXPO_PUBLIC_API_URL`. Pour LAN local, URL privée accessible depuis le téléphone ; ni `localhost` ni `10.0.2.2` pour un téléphone physique. |
| `PAWAPAY_SANDBOX_ENABLED`, `PAWAPAY_SANDBOX_CALLBACK_KEY_ID`, `PAWAPAY_SANDBOX_CALLBACK_PUBLIC_KEY` | API, facultatif | Uniquement pour callbacks Sandbox signés. Ne pas activer pour contourner une configuration manquante. |

L'admission testeur signée expire et se conserve dans SecureStore ; ce n'est pas la clé serveur.
Après admission et OTP, les routes privées vérifient une session Bearer persistée et l'appartenance des données.
Voir [le protocole](adr/0006-admission-testeur-preview.md) et [le guide d'exécution](preview-integration-runbook.md).

## Hors ligne et limites

- Code, tests unitaires et Metro fonctionnent après installation complète des dépendances.
- API locale et PostgreSQL local peuvent servir les téléphones sur le même LAN sans API distante ; pare-feu et adresse LAN à vérifier.
- Inscription, OTP serveur, restauration de session, portefeuille, historique et objectifs nécessitent l'API. Sans réseau, afficher l'erreur ; ne pas inventer un compte connecté ou un solde.
- Une session conservée dans SecureStore ne prouve pas que le serveur l'accepte : `/me` doit être validé avant ouverture du compte.
- Les builds Android et iOS sont distincts. Un export JavaScript Android ne constitue ni un APK installé ni un test téléphone.
- Risque de disponibilité réseau/hébergement : vérifier `/health` et les routes authentifiées avant présentation ; garder le secours local préparé, sans le déclarer prêt avant parcours complet.
- Après le 13 novembre : validation Android/iOS sur appareils, SMS réel, révocation des admissions, durcissement/rate limiting, reprise hors ligne explicite, suivi CVE, paiements et tontines dans des lots revus séparément.

## Références officielles

- [Expo : variables d'environnement](https://docs.expo.dev/guides/environment-variables/)
- [Expo : comptes et organisations](https://docs.expo.dev/accounts/account-types/)
- [Expo : development builds et iOS cloud](https://docs.expo.dev/develop/development-builds/introduction/)
- [Render : création de déploiement](https://api-docs.render.com/reference/create-deploy)
- [Avis deepmerge](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)
