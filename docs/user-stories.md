# User stories

Chaque story suit le format « En tant que…, je veux…, afin de… ». Ses critères d'acceptation, au format « Étant donné… quand… alors… », sont les premiers tests à écrire (`AGENTS.md`, section 3.1). Les personas sont décrits dans [`user-journey.md`](user-journey.md), les parcours dans [`user-flows.md`](user-flows.md).

Priorités : **haute** (bloque la démonstration de la phase 0), **moyenne**, **basse**. Chaque story renvoie à ses issues.

## Sommaire

| Épopée                                   | Stories              | Phase |
| ---------------------------------------- | -------------------- | ----- |
| E1. Site public                          | US-SITE-01 à 05      | 0, 1  |
| E2. Authentification des membres         | US-AUTH-01 à 05      | 0, 1  |
| E3. Tontine, invitation, garanties       | US-TON-01 à 05       | 0     |
| E4. Tirage vérifiable                    | US-TIR-01 à 03       | 0     |
| E5. Coffre                               | US-COF-01 à 03       | 0, 1  |
| E6. Échéance et arbitrage                | US-ECH-01 à 04       | 0     |
| E7. Défaut                               | US-DEF-01 à 02       | 0     |
| E8. Distribution                         | US-DIS-01 à 02       | 0, 1  |
| E9. USSD                                 | US-USSD-01 à 02      | 0     |
| E10. Accès au back-office                | US-ADM-01 à 04       | 0     |
| E11. Intégrité et réconciliation         | US-INT-01 à 03       | 0     |
| E12. Support                             | US-SUP-01 à 03       | 0, 1  |

## E1. Site public

### US-SITE-01 Comprendre Mitemo en une minute

En tant que visiteur, je veux comprendre ce que fait Mitemo depuis la page d'accueil, afin de décider si cela me concerne.

- Étant donné la page d'accueil, quand elle s'affiche, alors la promesse, les quatre étapes du cycle et le bouton Télécharger sont visibles sans défilement sur un téléphone.
- Étant donné n'importe quelle page publique, quand on la lit, alors elle ne contient aucun des mots bannis (`architecture-information.md`, section 3.1).

Phase 0, priorité moyenne, #46.

### US-SITE-02 Savoir où est l'argent

En tant que présidente de tontine, je veux savoir qui détient les fonds et ce que Mitemo ne fait pas, afin de pouvoir rassurer mon groupe.

- Étant donné la page Sécurité, quand elle s'affiche, alors elle explique la détention des fonds, le tirage vérifiable et la liste « Mitemo ne prête pas, ne promet aucun rendement ».
- Étant donné qu'aucune convention avec un partenaire agréé n'est signée, quand la page est publiée, alors aucun nom de partenaire n'y figure.

Phase 0, priorité moyenne, #46.

### US-SITE-03 Connaître les frais avant de m'engager

En tant que visiteuse, je veux voir les frais sur un exemple chiffré, afin de ne découvrir aucun frais après coup.

- Étant donné la page Frais, quand elle s'affiche, alors l'exemple de 10 membres à 5 000 FCFA donne une cagnotte de 45 000 FCFA, des frais de 675 FCFA et un net de 44 325 FCFA.
- Les chiffres affichés sont calculés par la même fonction que celle de l'API, importée de `@mitemo/contracts` ou testée contre les mêmes cas.

Phase 0, priorité moyenne, #46.

### US-SITE-04 Installer l'application selon mon téléphone

En tant que visiteuse, je veux un moyen d'installation adapté à mon téléphone, afin de commencer sans aide.

- Étant donné la page Télécharger, quand elle s'affiche, alors elle propose Google Play, l'APK direct avec sa taille, et le code USSD pour les téléphones simples.
- Étant donné un lien d'invitation ouvert sans l'application, quand la page s'affiche, alors l'invitation est reprise après l'installation.

Phase 0, priorité moyenne, #46.

### US-SITE-05 Lire les conditions avant d'accepter

En tant que membre, je veux lire les conditions, la politique de confidentialité et le règlement de groupe, afin de savoir à quoi je m'engage.

- Les pages légales existent et sont liées depuis le pied de page et depuis l'inscription.
- Leur contenu est validé par un avocat avant la phase 1 (`audit/02`, section 7).

Phase 1, priorité moyenne, #50.

## E2. Authentification des membres

### US-AUTH-01 M'inscrire avec mon numéro

En tant que membre, je veux m'inscrire avec mon seul numéro de téléphone, afin de ne fournir aucune pièce d'identité.

- Étant donné un numéro qui n'est pas un numéro congolais valide selon `libphonenumber-js`, quand il est soumis, alors l'inscription est refusée.
- Étant donné un OTP correct et non expiré, quand il est saisi, alors l'appareil est lié et la création du code secret commence.

Phase 0, priorité haute, `app:api` #9, `app:mobile` #23.

### US-AUTH-02 Protéger mon compte par un code secret

En tant que membre, je veux un code secret à six chiffres, afin que personne d'autre ne puisse utiliser mon argent.

- Étant donné un code de confirmation différent, quand il est saisi, alors l'écran le signale sans appel réseau.
- Étant donné un code évident (`123456`, `000000`), quand il est choisi, alors il est refusé.
- Le code est haché en Argon2id et n'apparaît dans aucun journal.

Phase 0, priorité haute, #9, #23.

### US-AUTH-03 Être protégé contre les essais répétés

En tant que membre, je veux que mon compte se verrouille après plusieurs codes faux, afin qu'un voleur ne puisse pas deviner mon code.

- Étant donné trois codes secrets faux, quand un quatrième est tenté, alors le compte est verrouillé temporairement avec un délai croissant.
- La même règle s'applique aux OTP.

Phase 0, priorité haute, #9.

### US-AUTH-04 Retrouver l'accès si j'oublie mon code

En tant que membre, je veux réinitialiser mon code secret par OTP, afin de ne pas perdre l'accès à mon coffre.

- Étant donné une réinitialisation, quand elle aboutit, alors l'ancien code ne fonctionne plus et l'opération est journalisée.
- Phase 1 : les sorties de fonds sont gelées pendant la carence.

Phase 0, priorité moyenne, #9, #23.

### US-AUTH-05 Changer de téléphone sans risque de vol

En tant que membre, je veux être prévenu et pouvoir bloquer mon compte quand un nouvel appareil s'y connecte, afin d'être protégé contre le *SIM swap*.

- Étant donné une connexion depuis un nouvel appareil, quand elle aboutit, alors une notification part vers l'ancien appareil et un SMS vers le numéro.
- Étant donné la carence en cours, quand une sortie de fonds est demandée, alors elle est refusée ; les entrées restent possibles.

Phase 1, priorité haute pour le pilote, #40, #51.

## E3. Tontine, invitation, garanties

### US-TON-01 Créer ma tontine avec les règles de mon groupe

En tant que présidente, je veux créer une tontine avec le montant, le nombre de membres et la fréquence de mon groupe, afin de reproduire ce que nous faisons déjà.

- Étant donné un montant non entier ou nul, quand la tontine est créée, alors la création est refusée.
- Étant donné les paramètres saisis, quand le récapitulatif s'affiche, alors il montre la cagnotte par tour, les frais Mitemo et la garantie par membre.

Phase 0, priorité haute, #10, #24.

### US-TON-02 Inviter les membres de mon groupe

En tant que présidente, je veux un lien d'invitation à usage unique par membre, afin que personne d'extérieur ne rejoigne ma tontine.

- Étant donné un lien déjà utilisé ou expiré, quand il est ouvert, alors l'adhésion est refusée avec un message clair.
- Étant donné une tontine complète, quand un lien est ouvert, alors l'adhésion est refusée.

Phase 0, priorité haute, #11, #25.

### US-TON-03 Rejoindre en connaissant les règles

En tant que membre invitée, je veux voir le montant, la fréquence, les frais et la garantie avant d'accepter, afin de m'engager en connaissance de cause.

- Étant donné une invitation valide, quand elle s'ouvre, alors tous ces éléments sont affichés avant le bouton d'acceptation.

Phase 0, priorité haute, #25.

### US-TON-04 Bloquer ma garantie

En tant que membre, je veux bloquer ma garantie depuis mon coffre, afin que le groupe soit protégé contre un défaut.

- Étant donné une cotisation de 5 000 FCFA, quand je bloque ma garantie, alors 2 500 FCFA passent de mon disponible à « mis de côté ».
- Étant donné un disponible insuffisant, quand je veux bloquer ma garantie, alors l'application me propose de mettre de l'argent.

Phase 0, priorité haute, #12, #25.

### US-TON-05 Récupérer ma garantie si le groupe ne démarre pas

En tant que membre, je veux récupérer ma garantie si le groupe ne se remplit pas, afin que mon argent ne reste pas bloqué.

- Étant donné une tontine dont le délai de recrutement est écoulé, quand elle passe en `ANNULEE`, alors chaque membre récupère exactement sa garantie.

Phase 0, priorité haute, #12.

## E4. Tirage vérifiable

### US-TIR-01 Connaître le code de contrôle avant le tirage

En tant que membre, je veux voir le code de contrôle 48 h avant le tirage, afin d'être sûre que le résultat est déjà fixé et ne peut pas être changé.

- Étant donné une tontine en `TIRAGE_ORDRE`, quand j'ouvre l'écran du tirage, alors je vois le code de contrôle et l'heure du tirage.

Phase 0, priorité haute, #13, #26.

### US-TIR-02 Vérifier moi-même l'ordre de passage

En tant que membre, je veux vérifier le tirage sur mon téléphone, afin de ne pas avoir à faire confiance à la présidente ni à Mitemo.

- Étant donné la graine révélée, quand je touche « Vérifier », alors le calcul est refait sur le téléphone et le résultat s'affiche en vert ou en rouge.
- Étant donné une graine dont l'empreinte diffère du code publié, quand je vérifie, alors le résultat est rouge.

Phase 0, priorité haute, #13, #26.

### US-TIR-03 Permettre à n'importe qui de vérifier

En tant que jury ou journaliste, je veux vérifier un tirage depuis le site, sans compte, afin de constater qu'il n'a pas été manipulé.

- Étant donné un identifiant de tirage, quand il est saisi sur `/verifier-un-tirage`, alors l'ordre recalculé est comparé à l'ordre publié.
- La page n'expose aucun numéro de téléphone : les membres sont des identifiants opaques.

Phase 0, priorité haute, #13, #38, #47.

## E5. Coffre

### US-COF-01 Mettre de l'argent depuis Mobile Money

En tant que membre, je veux mettre de l'argent dans mon coffre depuis MTN ou Airtel, afin de préparer mes échéances.

- Étant donné une réponse de l'opérateur sans confirmation, quand le dépôt est en cours, alors mon disponible n'augmente pas et le montant apparaît « en attente ».
- Étant donné une confirmation reçue deux fois, quand elle est traitée, alors mon coffre n'est crédité qu'une fois.

Phase 0, priorité haute, #15, #27.

### US-COF-02 Distinguer ce qui est disponible de ce qui est mis de côté

En tant que membre, je veux voir séparément mon disponible et ce qui est mis de côté, afin de savoir ce que je peux réellement utiliser.

- Étant donné une garantie bloquée, quand j'ouvre l'accueil, alors elle n'est pas comptée dans le disponible.

Phase 0, priorité haute, #22, #27.

### US-COF-03 Retirer mon disponible

En tant que membre, je veux retirer mon disponible vers Mobile Money, afin d'utiliser mon argent hors de Mitemo.

- Étant donné un retrait, quand l'opérateur est indisponible, alors la demande est réessayée et son état est visible.
- Les frais éventuels sont affichés avant la validation.

Phase 1, priorité moyenne, #42, #52.

## E6. Échéance et arbitrage

### US-ECH-01 Être prévenue avant l'échéance

En tant que membre, je veux un rappel avant l'échéance, afin d'avoir le temps de mettre de l'argent.

- Étant donné un cycle long, quand l'échéance est à 10 jours, alors un rappel est envoyé (cahier des charges, section 2.1).
- Étant donné le plafond quotidien atteint, quand un rappel non critique doit partir, alors il n'est pas envoyé (`audit/04`, section 3).

Phase 0, priorité moyenne, #16, #39.

### US-ECH-02 Payer mon échéance d'un geste

En tant que membre, je veux payer mon échéance depuis la notification, afin que rien ne parte sans mon accord.

- Étant donné un disponible suffisant et un code secret correct, quand je choisis « Payer maintenant », alors le montant passe de mon coffre à la cagnotte, sans frais.

Phase 0, priorité haute, #17, #28.

### US-ECH-03 Reporter un paiement sans être pénalisée

En tant que membre, je veux reporter une échéance un jour difficile, afin de ne pas tomber en incident pour un retard d'un jour.

- Étant donné un cycle journalier, quand je choisis « Plus tard », alors le gel dure 12 heures.
- Étant donné deux reports déjà utilisés dans le cycle, quand je choisis « Plus tard », alors mon adhésion passe en attente.
- Le nombre de reports restants est affiché sur l'écran d'échéance.

Phase 0, priorité haute, #17, #28.

### US-ECH-04 Ne pas pouvoir geler mon propre tour

En tant que groupe, nous voulons que la bénéficiaire du tour ne puisse pas le reporter, afin que personne ne bloque le tour dont il profite.

- Étant donné la bénéficiaire du tour, quand elle ouvre l'écran d'échéance, alors « Plus tard » n'est pas proposé.

Phase 0, priorité haute, #17, #28.

## E7. Défaut

### US-DEF-01 Être payée à l'heure même si une membre fait défaut

En tant que bénéficiaire, je veux recevoir toute la cagnotte à l'heure même si une membre n'a pas payé, afin de pouvoir compter sur Mitemo.

- Étant donné une membre défaillante à T + 24 h, quand la distribution a lieu, alors la bénéficiaire reçoit la totalité de la cagnotte.
- Le manque est couvert dans l'ordre : disponible du défaillant, sa garantie, puis la réserve commune au prorata.

Phase 0, priorité haute, #19.

### US-DEF-02 Savoir comment redevenir en règle

En tant que membre en incident, je veux savoir exactement ce que je dois payer, afin de redevenir à jour.

- Étant donné une membre en incident sur une cotisation de 5 000 FCFA, quand elle ouvre l'application, alors elle voit sa dette, la pénalité de 100 FCFA et le montant pour reconstituer sa garantie.
- Étant donné un retard dû à l'opérateur et prouvé par les traces, quand la régularisation a lieu, alors aucune pénalité n'est appliquée (`audit/05`, section 3.2).

Phase 0, priorité haute, #19, #49.

## E8. Distribution

### US-DIS-01 Recevoir ma cagnotte dans mon coffre

En tant que bénéficiaire, je veux recevoir ma cagnotte nette dans mon coffre dès la fin du tour, afin d'en disposer tout de suite.

- Étant donné C = 5 000 FCFA et N = 10, quand le tour est distribué, alors je reçois 44 325 FCFA et Mitemo encaisse 675 FCFA.
- Une notification et un SMS de réception sont envoyés.

Phase 0, priorité haute, #18.

### US-DIS-02 Connaître le coût réel de mon cycle

En tant que membre, je veux voir ce que j'ai versé, reçu et payé en frais sur tout le cycle, afin de vérifier qu'il n'y a rien de caché.

- Étant donné un cycle terminé, quand j'ouvre l'historique, alors versé, reçu, frais et garantie rendue sont affichés au franc près.

Phase 1, priorité moyenne, #43, #53.

## E9. USSD

### US-USSD-01 Payer mon échéance sans smartphone

En tant que membre avec un téléphone simple, je veux payer mon échéance par le code court, afin de participer sans smartphone.

- Étant donné une session USSD et un code secret correct, quand je choisis « Payer maintenant », alors le résultat est identique à celui de l'application.
- Étant donné une session coupée, quand je recompose le code, alors aucune opération partielle n'a été enregistrée.

Phase 0, priorité moyenne, #20.

### US-USSD-02 Consulter mon coffre par USSD

En tant que membre avec un téléphone simple, je veux voir mon disponible et ce qui est mis de côté, afin de savoir si je suis prêt.

- Chaque écran tient en 160 caractères au plus.

Phase 0, priorité moyenne, #20.

## E10. Accès au back-office

### US-ADM-01 Me connecter avec un second facteur

En tant que membre du personnel, je veux me connecter avec mon adresse, mon mot de passe et un code à usage unique, afin que mon compte ne puisse pas être utilisé avec un mot de passe volé.

- Étant donné un mot de passe correct et un code faux, quand je me connecte, alors l'accès est refusé avec le même message que pour un mot de passe faux.
- Étant donné plusieurs échecs, quand une nouvelle tentative a lieu, alors le compte est verrouillé temporairement.
- Chaque connexion, réussie ou non, est écrite au journal d'audit.

Phase 0, priorité haute, #36, #37, #48.

### US-ADM-02 Être déconnecté après inactivité

En tant que responsable de la sécurité, je veux que les sessions du back-office expirent, afin qu'un poste laissé ouvert ne donne pas accès aux données.

- Étant donné une session inactive au-delà du délai, quand une page est demandée, alors l'utilisateur revient à la connexion.
- Le cookie de session est `HttpOnly`, `Secure` et `SameSite=Strict`.

Phase 0, priorité haute, #36, #48.

### US-ADM-03 Ne voir que ce que mon rôle permet

En tant qu'administrateur, je veux attribuer un rôle à chaque compte du personnel, afin d'appliquer le moindre privilège.

- Étant donné un compte `viewer`, quand il appelle un endpoint réservé à un autre rôle, alors l'API répond par un refus et l'essai est journalisé.
- Étant donné un jeton de membre, quand il appelle `/admin/...`, alors l'API le refuse.

Phase 0, priorité haute, #36.

### US-ADM-04 Gérer les comptes du personnel

En tant qu'administrateur, je veux créer, désactiver et changer le rôle d'un compte du personnel, afin que les départs soient pris en compte immédiatement.

- Étant donné un compte désactivé, quand sa session existante fait une requête, alors elle est refusée.
- Il n'existe aucune page d'inscription publique.

Phase 0, priorité moyenne, #36, #48.

## E11. Intégrité et réconciliation

### US-INT-01 Voir l'état d'intégrité en un coup d'œil

En tant que responsable des opérations, je veux voir l'écart de réconciliation, la chaîne de hachage et le compte de suspens en haut de page, afin de savoir chaque matin si tout boucle.

- Étant donné un écart non nul, quand la page s'affiche, alors il apparaît en rouge en tête de page.

Phase 0, priorité haute, #21, #29.

### US-INT-02 Repérer la première écriture falsifiée

En tant que responsable des opérations, je veux savoir quelle écriture casse la chaîne de hachage, afin d'enquêter immédiatement.

- Étant donné une écriture modifiée en base, quand la chaîne est vérifiée, alors la première écriture invalide est désignée.

Phase 0, priorité moyenne, #7, #29.

### US-INT-03 Être alertée d'un écart

En tant que responsable des opérations, je veux une alerte dès qu'un écart ou une écriture en suspens apparaît, afin de ne pas l'apprendre une semaine plus tard.

- Étant donné un écart introduit dans le simulateur, quand la réconciliation tourne, alors une alerte est levée.

Phase 0, priorité haute, #21.

## E12. Support

### US-SUP-01 Retrouver une membre sans voir son numéro complet

En tant qu'agente du support, je veux retrouver une membre par la fin de son numéro, afin de l'aider sans exposer ses données.

- Étant donné une recherche par les quatre derniers chiffres, quand les résultats s'affichent, alors les numéros sont masqués.
- Étant donné l'affichage du numéro complet, quand il est demandé, alors un motif est exigé et l'accès est journalisé.

Phase 0, priorité moyenne, #30.

### US-SUP-02 Comprendre pourquoi une membre est en orange

En tant qu'agente du support, je veux l'historique des états d'une adhésion avec leur motif et leur déclencheur, afin d'expliquer la situation au téléphone.

- Étant donné une adhésion, quand j'ouvre sa fiche, alors chaque transition affiche l'auteur, l'heure, le motif et le déclencheur (`audit/03`, section 2).

Phase 0, priorité moyenne, #30.

### US-SUP-03 Ouvrir et suivre un litige

En tant qu'agente du support, je veux ouvrir un litige et suivre son délai d'engagement, afin que chaque réclamation reçoive une réponse dans le délai publié.

- Étant donné un litige ouvert, quand le délai de 72 heures ouvrées approche, alors il est signalé (`audit/05`, section 4.1).

Phase 1, priorité haute pour le pilote, #44, #54.

## Issues

Toutes les stories ont désormais une issue. Les issues sont assignées selon la règle de l'équipe : backend à Patrick, vues à Espoir (`CONTRIBUTING.md`, section Issues).
