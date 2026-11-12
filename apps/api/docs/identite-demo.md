# Intégration mobile de l’identité de démonstration

Depuis le checkout isolé, configurer `apps/api/.env` avec la connexion directe à PostgreSQL local `mitemo_dev` et `MITEMO_DEMO_AUTH=true`. Après installation figée des dépendances et application des migrations nécessaires avec `pnpm --filter api exec prisma migrate deploy`, lancer les commandes suivantes depuis la racine.

```powershell
pnpm --filter @mitemo/contracts build
pnpm --filter api build
pnpm --filter api start
```

L’API écoute par défaut sur `http://localhost:3000`. Swagger est disponible à `http://localhost:3000/docs` lorsque le mode de démonstration est activé. Depuis un téléphone physique, utiliser l’adresse du poste sur le réseau local.

| Requête | Corps TypeScript dans `@mitemo/contracts` | Réponse |
| --- | --- | --- |
| POST /auth/register | RegisterDemoUserRequest | 201 CurrentUser |
| POST /auth/login | StartLoginRequest | 200 StartLoginResponse |
| POST /auth/verify | VerifyLoginRequest | 200 SessionResponse |
| GET /me | Aucun | 200 CurrentUser |
| PATCH /me | UpdateCurrentUserRequest | 200 CurrentUser |
| POST /auth/refresh | Aucun | 200 SessionResponse |
| DELETE /auth/session | Aucun | 204 |

Envoyer le JSON avec `Content-Type: application/json`. L’inscription prend un `phoneNumber` congolais E.164, un `displayName` et un `pin` à six chiffres. La connexion reprend `phoneNumber` et `pin`, puis la vérification reçoit `challengeId` et `otp`. Utiliser le champ `simulatedOtp` uniquement dans le parcours de démonstration. Aucun SMS n’est envoyé.

Les quatre dernières routes exigent `Authorization: Bearer <accessToken>`. Enregistrer le jeton dans SecureStore. Lors d’un renouvellement réussi, remplacer l’ancien jeton par celui de la réponse. Sur une réponse 401, supprimer le jeton et demander une nouvelle connexion. Les autres réponses attendues sont 400 pour une entrée invalide, 409 pour un numéro déjà inscrit et 429 pour une limite de tentatives.

L’OTP retourné valide le parcours simulé. Il ne prouve pas la possession du numéro. L’authentification de démonstration est désactivée en production.

## Exemples d’appels

```text
POST /auth/register
{"phoneNumber":"+242061234567","pin":"<six chiffres de démonstration>","displayName":"Démo Mitemo"}

POST /auth/login
{"phoneNumber":"+242061234567","pin":"<le même PIN>"}

POST /auth/verify
{"challengeId":"<challengeId>","otp":"<simulatedOtp>","deviceLabel":"Émulateur Android"}

GET /me
Authorization: Bearer <accessToken>
```

`GET /auth/sessions` retourne les sessions actives de l’utilisateur et indique la session courante. `DELETE /auth/sessions/{id}` révoque une session du même utilisateur. Le libellé de l’appareil est facultatif et sert uniquement à l’affichage.


## Réponses et traitement côté client

- `POST /auth/login` → `{"challengeId":"<uuid>","expiresAt":"<UTC>","simulatedOtp":"<six chiffres>"}`. Afficher clairement « Code simulé ». Le défi expire en cinq minutes.
- `POST /auth/verify` → `{"accessToken":"<jeton opaque>","expiresAt":"<UTC>","user":{"userId":"<uuid>","displayName":"Démo Mitemo","maskedPhoneNumber":"+242*****67","role":"USER"}}`. Ne jamais journaliser le corps. Stocker le jeton dans SecureStore.
- `GET /me` renvoie l’objet `user`. `PATCH /me` accepte `{"displayName":"Nouveau nom"}`. La rotation répond avec un nouveau jeton et invalide le précédent.
- Une réponse `401` aux routes OTP peut indiquer une clé absente ou invalide, un PIN incorrect ou un défi inutilisable. Sur le profil, vérifier d’abord la configuration de la clé. Si elle est valide, traiter le bearer comme expiré ou révoqué et redemander une connexion.
- `400` signale une saisie invalide, `409` un numéro déjà inscrit, `429` une limite de requêtes et `404` un mode indisponible ou une session cible inaccessible. Après un délai réseau, une rotation de session peut avoir réussi côté serveur. Si le jeton conservé est refusé, redemander une connexion.
