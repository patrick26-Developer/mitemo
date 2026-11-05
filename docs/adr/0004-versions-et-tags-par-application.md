# 0004. Versions et tags par application, créés par release-please

- Statut : accepté
- Date : 2026-11-05

## Contexte

Le déploiement en production doit partir d'une version identifiée, pour savoir à tout moment ce qui tourne et pouvoir revenir en arrière. Les trois applications ne se publient pas au même rythme : l'API sur un serveur, le web chez un hébergeur, le mobile par un build Android soumis à la revue de Google Play.

Options étudiées :

- une version unique pour tout le monorepo, ou une version par application ;
- des tags créés à la main, ou des tags créés à la fusion d'une PR de version générée depuis les commits.

Les commits suivent déjà Conventional Commits, vérifiés par commitlint : la version suivante peut en être déduite sans choix manuel.

Outil retenu après vérification (novembre 2026) :

- [release-please](https://github.com/googleapis/release-please), maintenu par Google, licence Apache-2.0, dernière version 17.11.2 (24 août 2026), aucun avis de sécurité publié.
- [release-please-action](https://github.com/googleapis/release-please-action) v5.0.0 (22 avril 2026), licence Apache-2.0, aucun avis de sécurité publié.
- Sources : dépôts GitHub, [documentation du mode manifeste](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md), base d'avis GitHub.

## Décision

1. **Une version SemVer par application** : `apps/api`, `apps/web` et `apps/mobile` ont chacune leur version et leur `CHANGELOG.md`. `packages/contracts` n'est pas versionné : il n'est jamais publié, seulement consommé dans le monorepo.
2. **Tags au format `<application>-v<version>`** : `api-v0.1.0`, `web-v0.1.0`, `mobile-v0.1.0`.
3. **Une PR de version par application**, tenue à jour sur `main` par le workflow `release.yml`. Sa fusion crée le tag et la release GitHub.
4. **Règle de calcul**, tant que la version est inférieure à 1.0.0 :

   | Commits depuis la dernière version | Version suivante |
   | ---------------------------------- | ---------------- |
   | `fix:` seulement                   | 0.1.0 → 0.1.1    |
   | au moins un `feat:`                | 0.1.0 → 0.1.1    |
   | au moins un changement cassant (`!`) | 0.1.0 → 0.2.0  |

   Le passage en 1.0.0 se décide explicitement, au lancement du pilote réel.

5. **Seule la production passe par un tag.** `staging` se déploie à chaque fusion, sans tag.

## Conséquences

Plus simple :

- aucune version choisie à la main, et le `CHANGELOG.md` de chaque application s'écrit seul ;
- un correctif de l'API ne force pas une nouvelle version mobile.

Plus difficile :

- **jeton** : une PR créée avec le `GITHUB_TOKEN` par défaut ne déclenche aucun workflow, donc ni les contrôles obligatoires ni l'assignation automatique. Un administrateur doit créer le secret `RELEASE_PLEASE_TOKEN` : jeton à grain fin d'un membre de l'équipe, limité à ce dépôt, avec les droits *Contents*, *Pull requests* et *Issues* en écriture. La PR de version est alors au nom de ce membre et lui est assignée ;
- **exception au flux** : la PR de version est la seule PR qui cible `main` sans venir de `staging`. Elle ne modifie que les `CHANGELOG.md`, les versions des `package.json` et `.release-please-manifest.json` ;
- **retour vers `develop`** : après chaque release, une PR `main` → `develop` ramène ces fichiers, pour éviter des conflits sur `package.json` ;
- un commit qui touche seulement `packages/contracts` ne crée de version pour aucune application. Si un changement de contrat doit être livré, il s'accompagne d'un commit dans l'application concernée.

À surveiller :

- **le déploiement lui-même n'est pas encore écrit** : l'hébergement n'est pas choisi (`docs/architecture-systeme.md`, section 8). Les tags créés avec le `GITHUB_TOKEN` ne déclenchent pas d'autre workflow : les jobs de déploiement iront donc dans `release.yml`, conditionnés par la sortie `apps/<application>--release_created` de release-please ;
- les `CHANGELOG.md` générés sont exclus de Prettier (`.prettierignore`), qui les reformaterait.
