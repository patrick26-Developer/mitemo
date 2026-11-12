# Raccordement des écrans Expo existants

Le client partagé est `apps/mobile/src/shared/api/client.http.ts`. `apiRequest` lit déjà `EXPO_PUBLIC_API_URL`. Son seul wrapper concret, `apiClient.registerPushToken`, vise une route de notification hors de P0 et P1. Les flux de connexion et de portefeuille actuels utilisent les modèles et stores locaux.

| Écran ou état Expo | Point existant | Raccordement minimal |
| --- | --- | --- |
| Inscription | `hook.sign-up-form`, `hook.pin-validation`, `CredentialVault` | Brancher `POST /auth/register` via `apiRequest<CurrentUser>`. Envoyer `RegisterDemoUserRequest`. Le PIN du serveur comporte six chiffres, le PIN local en comporte quatre. Garder le PIN local pour son usage sur l’appareil et demander séparément le PIN serveur dans le parcours de test. |
| Connexion | `hook.sign-in-form`, `hook.pin-session` | Appeler `POST /auth/login` avec `StartLoginRequest`, puis `POST /auth/verify` avec `VerifyLoginRequest`. Rendre explicite le caractère simulé de l’OTP. Conserver le bearer de `SessionResponse` dans SecureStore. |
| Profil et session | `(tabs)/profile`, `store.session` | Hydrater le profil via `GET /me`, envoyer uniquement le nom à `PATCH /me`, puis intégrer `POST /auth/refresh` et `DELETE /auth/session`. Remplacer le bearer lors d’une rotation réussie. |
| Accueil | `(tabs)/index`, `store.portfolio` | Lire `GET /wallet` avec `WalletSummaryResponse`. Garder les montants du contrat sous forme de chaînes XAF en transit. Afficher le mode simulé. |
| Historique | `history`, portefeuille local | Lire `GET /wallet/movements` avec `WalletMovementsResponse`. Utiliser `nextCursor` pour la suite et dédupliquer par `movementId`. |
| Versement démo | Actions du portefeuille local | Appeler `POST /wallet/demo-funding` et rafraîchir le solde après confirmation. Conserver le même UUID pour un rejeu. Le générateur privé du wrapper de notifications ajoute `mobile-`. Le versement exige un UUID brut. |

Compléter les options du client partagé pour transmettre le bearer et la clé Preview et traiter le statut 204 avant tout décodage JSON. Le client actuel construit seulement les en-têtes de contenu et d’idempotence et décode systématiquement la réponse de succès. Gérer les erreurs HTTP par leur statut et traiter les erreurs de transport séparément. Un 401 peut aussi venir de la clé Preview. Sur un échec de rotation, revalider la session avant de redemander une connexion.

La clé Preview est fournie hors bande pour les tests internes. Ne jamais l’intégrer dans `EXPO_PUBLIC_API_URL`, une autre variable `EXPO_PUBLIC_*` ou un bundle. Les guides [P0](identite-demo.md) et [P1](portefeuille-demo.md) détaillent les URL, en-têtes, corps et erreurs. L’adresse HTTPS sera celle attribuée au service Render.
