# API MVP pour Expo

Le serveur ne configure aucun préfixe global. En local, utiliser l’IPv4 LAN du poste et le port 3000. Pour Preview, utiliser https://mitemo-api-dev.onrender.com après validation du déploiement. Configurer EXPO_PUBLIC_API_URL dans Expo. En Preview, les routes d’identité et de portefeuille demandent X-Mitemo-Preview-Key en plus du Bearer lorsqu’il est indiqué. Garder cette clé hors du bundle.

| Écran ou service | Action | Endpoint et entrée | Réponse | Autorisation | État API et test |
| --- | --- | --- | --- | --- | --- |
| Inscription | Créer le compte fictif | POST /auth/register, RegisterDemoUserRequest | 201 CurrentUser | Démo | Présent, identity.e2e-spec.ts |
| Connexion / PIN | Obtenir le défi | POST /auth/login, StartLoginRequest | 200 StartLoginResponse | Démo | Présent, identity.e2e-spec.ts |
| Connexion / PIN | Valider le code | POST /auth/verify, VerifyLoginRequest | 200 SessionResponse | Démo | Présent, identity.e2e-spec.ts |
| Profil | Lire ou renommer le profil | GET /me ou PATCH /me, UpdateCurrentUserRequest | 200 CurrentUser | Bearer propriétaire | Présent, identity.e2e-spec.ts |
| Profil / sécurité | Tourner le jeton | POST /auth/refresh | 200 SessionResponse | Bearer courant | Présent, identity.e2e-spec.ts |
| Profil / sécurité | Lister et révoquer les sessions | GET /auth/sessions, DELETE /auth/session, DELETE /auth/sessions/:id | 200 ActiveSession[] ou 204 | Bearer propriétaire | Présent, identity.e2e-spec.ts |
| Accueil | Afficher le solde | GET /wallet | 200 WalletSummaryResponse | Bearer propriétaire | Présent, wallet.e2e-spec.ts |
| Historique | Lister les mouvements | GET /wallet/movements?limit=20&cursor=UUID | 200 WalletMovementsResponse | Bearer propriétaire | Présent, wallet.e2e-spec.ts |
| Accueil | Ajouter le crédit fictif fixe | POST /wallet/demo-funding, SimulateFundingRequest et Idempotency-Key UUID | 200 SimulateFundingResponse | Bearer propriétaire, Preview | Présent, wallet.e2e-spec.ts. Pour une démo publique, prévoir une autorisation opérateur distincte avant exposition. |
| Profil | Photo et préférences | — | — | À définir | Stockage mobile, API absente |
| Épargne / détail | Créer un objectif, consulter calendrier et carte, consulter ou confirmer les cotisations | — | — | Propriétaire à contrôler | API absente. Fréquence, échéances et transitions à confirmer |
| Tontines / détail / recherche | Créer, chercher, rejoindre, inviter, gérer rôles et cotisations | — | — | Membre ou gestionnaire selon action | API absente. Règles d’adhésion et pouvoirs à confirmer |
| Tontines / épargne | Planifier tours, distribuer, retirer | — | — | Politique à définir | API absente. Conditions, ordre et seuils à confirmer |
| PawaPay | Recevoir une observation Sandbox | POST /integrations/pawapay/sandbox/callback | Accusé de réception | Signature fournisseur en Preview | Présent, sandbox-callback.controller.spec.ts. Sans crédit comptable |
| Paiement | Initier, consulter et rapprocher dépôt ou retrait | — | — | Propriétaire et confirmation fournisseur | API absente |
| Notifications / justificatifs | Enregistrer le push ou consulter une preuve | — | — | À définir | Client push présent, route serveur absente |
| Administration / paramètres | Administrer les paramètres économiques | — | — | Rôles à confirmer | API absente |
| Audit / rapprochement / support | Consulter événements et traiter écarts | — | — | Rôles à confirmer | API absente |
| Santé | Tester la disponibilité HTTP | GET /health | 200 {status: ok} | Public | Présent, health.e2e-spec.ts |
| Documentation | Consulter Swagger et OpenAPI | GET /docs, GET /docs-json | HTML ou JSON | Démo locale ou Basic Preview (utilisateur preview, clé fournie par l’opérateur) | openapi.e2e-spec.ts |

Les types réseau existants sont dans @mitemo/contracts. Les montants XAF sont des chaînes d’entier dans un objet MoneyDto. Utiliser nextCursor uniquement quand il est renvoyé. Conserver le jeton utilisateur dans SecureStore et remplacer le jeton au renouvellement. En Preview, Swagger sert à consulter le contrat et les essais HTTP se font depuis un client séparé.

Le prochain lot métier doit définir une tranche testable avec les règles produit validées. Un dépôt PawaPay Sandbox requiert une intention persistée et une confirmation rapprochée avant toute écriture. Le récepteur signé actuel enregistre des observations.
