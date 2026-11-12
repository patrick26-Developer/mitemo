# PawaPay Sandbox v2

Le récepteur écoute en Preview sur `POST /integrations/pawapay/sandbox/callback`. L’URL à enregistrer après déploiement et vérification est `https://mitemo-api-dev.onrender.com/integrations/pawapay/sandbox/callback`. La même URL traite les dépôts, décaissements et remboursements, selon leur identifiant propre. Le parcours Payment Page v2 produit un callback de dépôt. Si le champ « Payments » du tableau de bord correspond à un autre produit, confirmer son contrat avant de le renseigner.

| Flux | Identifiant et données spécifiques | Récupération du statut |
| --- | --- | --- |
| [Deposit](https://docs.pawapay.io/v2/api-reference/deposits/deposit-callback) | `depositId`, `payer` et éventuellement `requestedAmount` distinct du montant effectif | `GET /v2/deposits/{depositId}` |
| [Payout](https://docs.pawapay.io/v2/api-reference/payouts/payout-callback) | `payoutId`, `recipient` | `GET /v2/payouts/{payoutId}` |
| [Payment Page](https://docs.pawapay.io/v2/docs/payment_page) | Dépôt avec `depositId`. La redirection de retour est distincte de la notification serveur. | Même endpoint que Deposit |
| [Refund](https://docs.pawapay.io/v2/api-reference/refunds/refund-callback) | `refundId`, `recipient`. Conserver la relation au dépôt à l’initiation du remboursement. | `GET /v2/refunds/{refundId}` |

Les appels sortants utilisent `Authorization: Bearer <jeton Sandbox>` vers `https://api.sandbox.pawapay.io`. Les GET renvoient `FOUND` avec les données de l’opération ou `NOT_FOUND`. Le statut métier se lit dans les données. Le récepteur conserve `PROCESSING`, `COMPLETED` et `FAILED` comme observations. `ACCEPTED` et `ENQUEUED` sont des états d’initiation et ne déclenchent aucune comptabilisation. Vérifier `MTN_MOMO_COG`, `COG` et `XAF` dans la configuration active du compte avant les essais.

## Configuration

1. Déployer la PR approuvée et appliquer sa migration sur la base Preview vérifiée.
2. Activer la signature des callbacks dans le tableau de bord Sandbox. La vérification utilise les octets bruts, le condensat SHA-256 ou SHA-512 et le profil de signature P-256 documenté. Vérifier le profil émis par le Sandbox avant d’activer la route. Une autre variante de signature exige un test et une prise en charge explicite.
3. Enregistrer l’URL des callbacks. Générer un jeton dans le tableau de bord Sandbox avec un compte habilité et le conserver dans le gestionnaire de secrets. Utiliser ce jeton côté serveur pour lire les [clés publiques](https://docs.pawapay.io/v2/api-reference/toolkit/public-keys) via `GET /v2/public-key/http`. Confirmer l’identifiant et la clé P-256 du Sandbox.
4. Configurer `MITEMO_DEPLOYMENT=preview`, `PAWAPAY_SANDBOX_CALLBACK_KEY_ID`, `PAWAPAY_SANDBOX_CALLBACK_PUBLIC_KEY` (PEM) et `PAWAPAY_SANDBOX_ENABLED=true` sur `mitemo-api-dev`. Le jeton est nécessaire aux appels sortants de vérification et de réconciliation, jamais au récepteur statique. Mettre à jour la clé épinglée lors d’une rotation.

Le récepteur écrit des observations minimales dans `pawapay_sandbox_receipt`. Une contrainte PostgreSQL déduplique les reprises concurrentes. Les observations reçues dans le désordre sont conservées par statut et montant, sans écraser un résultat antérieur ni modifier un solde. Aucun numéro de téléphone, jeton ou payload brut n’est persisté. Les opérations fictives internes utilisent leur parcours existant.

## Validation HTTP

Envoyer une notification Sandbox signée, vérifier HTTP 200 et une ligne persistée. Rejouer le message signé pendant sa période de validité et vérifier qu’aucune ligne supplémentaire n’apparaît. Modifier le corps signé et vérifier 401. Tester un type ambigu, un montant non entier ou une autre devise signés et vérifier 400. Tester une route désactivée et vérifier 404.

La collecte et le décaissement applicatifs nécessitent encore la création d’intentions Sandbox persistées, le rapprochement par identifiant, opérateur, montant et devise, et l’écriture unique dans un périmètre comptable Sandbox. Les callbacks ne créditent aucun portefeuille. Pour un événement terminal divergent ou tardif, le futur rapprochement doit lire le GET officiel avant toute écriture.
