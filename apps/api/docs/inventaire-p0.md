# Inventaire de départ et modèle P0

La base de départ est `origin/develop` à `b1ed6b9`.

| Surface | État au départ | État après P0 |
| --- | --- | --- |
| Prisma | LedgerAccount, LedgerEntry, LedgerPostingLine | Ajout de AppUser, AuthChallenge et AuthSession |
| PostgreSQL local | Les trois tables du grand livre et le registre Prisma | Ajout de app_user, auth_challenge et auth_session |
| Contrats | Identité, portefeuille, cartes, notifications, tontines, adhésions, tours et transactions | Ajout des corps d’inscription et de modification du profil et du contrat de session active |
| Mobile | Écrans d’inscription, connexion, PIN, profil et historique. PIN et portefeuille locaux. | Écrans existants disponibles pour l’intégration HTTP |
| API | GET /health | Routes d’identité et de gestion des sessions décrites dans identite-demo.md |

Le profil et le rôle sont stockés sur le compte. Le libellé d’appareil est porté par la session. Les droits d’accès au profil et aux sessions sont vérifiés à partir du jeton présenté et de l’identifiant du propriétaire.

Le portefeuille nécessitera une relation entre l’utilisateur et son compte comptable `WALLET_USER`. Le montant disponible restera calculé à partir des lignes du grand livre. Les contrats financiers existants définissent la forme des réponses. Les routes et les données pour les autres domaines restent à construire selon les parcours validés.
