# SYNTHÈSE D'AUDIT - POINTS CRITIQUES

**Objet :** Revue des documents `document_vision_strat_gie_mitemo.md` et `cahier_des_charges_fonctionnel_mitemo.md`
**Date :** 4 novembre 2026
**Statut :** Revue externe, à challenger

---

## Ce qui est déjà juste et qu'il faut protéger

Ces choix sont bons et plusieurs sont contre-intuitifs. Ils ne doivent pas être perdus dans les itérations suivantes.

1. **Le positionnement en surcouche, pas en rail de paiement.** Ne pas chercher à remplacer MoMo/Airtel est la décision stratégique la plus importante du projet. Elle évite la guerre frontale et l'agrément le plus lourd.
2. **Le refus du prélèvement forcé** (§2.1). Dans un marché à faible confiance, un débit automatique non consenti tue le produit au premier incident. L'arbitrage explicite Accepter/Annuler est un choix de confiance, pas une limite technique.
3. **Le KYC allégé adossé à l'enrôlement SIM** (§1.2). C'est le bon raisonnement : la vérification d'identité a déjà été payée par l'opérateur. Il faut juste l'encadrer (voir `02-conformite-reglementaire.md`).
4. **Le code visuel à trois niveaux** (§4.2). Vert / Orange / Rouge au lieu de chiffres est la bonne réponse à l'analphabétisme fonctionnel et à l'anxiété financière.
5. **Le fonds de roulement de sécurité** (§3.1). Peu de projets de tontine numérique traitent le défaut de paiement. Celui-ci le fait dès la conception.
6. **Le scoring comme actif de sortie.** La vraie valeur à trois ans n'est pas la commission de 1,5 %, c'est l'historique. C'est bien vu.

---

## Les deux problèmes bloquants

### P1 - Le modèle économique est en perte d'environ 3× (l'hypothèse « API marchandes gratuites » est fausse)

Le §2 du cahier des charges repose sur cette phrase : « *un modèle de grand livre à compensation interne adossé aux API marchandes gratuites* », et le §2.4 annonce que les passerelles commerce « *garantissent un service gratuit pour l'utilisateur* ».

**Les API marchandes ne sont pas gratuites.** Au Congo-Brazzaville, l'ordre de grandeur constaté est de **3 % à 4 % sur l'encaissement** (*collection*) et **~1 % sur le décaissement** (*payout*), à la charge du marchand. Que l'utilisateur ne voie pas de frais ne signifie pas qu'il n'y en a pas : cela signifie que c'est Mitemo qui les paie.

Sur une tontine de 10 membres à 5 000 FCFA, 10 tours :

| Poste | Volume | Taux | Montant |
|---|---|---|---|
| Encaissements MoMo (approvisionnement des portefeuilles) | 450 000 FCFA | ~4 % | **−18 000 FCFA** |
| Décaissements MoMo (virements aux bénéficiaires) | 443 250 FCFA | ~1 % | **−4 433 FCFA** |
| **Coût total de paiement** | | | **−22 433 FCFA** |
| Recette commission plateforme | 450 000 FCFA | 1,5 % | **+6 750 FCFA** |
| **Résultat par cycle** | | | **−15 683 FCFA** |

La commission couvre **30 % du coût de transaction**. Et le cas le plus douloureux est précisément le cœur de cible : la **tontine journalière de commerçante de marché**, où chaque cotisation quotidienne déclenche un encaissement facturé.

Ce n'est pas un problème de prix à ajuster de quelques points de base. C'est un problème d'architecture de flux. Traité dans `01-modele-economique.md`.

### P2 - Le SMS comme canal principal est insoutenable financièrement et insuffisant juridiquement

**Coût.** Un SMS A2P vers le Congo coûte 23 à 56 FCFA via un agrégateur international, et de l'ordre de 8 à 20 FCFA en direct négocié avec l'opérateur. Or le moteur d'alertes des §2.1 et §2.3 est volontairement bavard : rappel à J−10, relances tous les 2 jours, « *rappel matinal de flux continu* » pour les cycles ultra-courts, SMS de conseil budgétaire, demande d'arbitrage, confirmation. Soit 7 à 8 messages par membre et par tour. Sur le cycle ci-dessus : **~14 000 FCFA de SMS**, plus du double de la recette de 6 750 FCFA. Le SMS seul coule le modèle.

**Sécurité et preuve.** Le §4.1 fait autoriser un **transfert de fonds** par une réponse `1` à un SMS. Il n'y a là aucune authentification : pas de code PIN, un identifiant d'expéditeur usurpable, un canal en clair, et un téléphone très souvent partagé ou prêté dans le foyer. C'est en contradiction directe avec le §2.6, qui exige à juste titre le PIN pour un transfert P2P. En cas de litige, Mitemo ne peut pas prouver que le titulaire a consenti.

**La réponse est l'USSD**, pas le SMS : session interactive, sur le réseau de l'opérateur donc non usurpable, capable de collecter un PIN de façon sûre, fonctionne sur tous les téléphones, initiée par l'utilisateur donc sans coût d'envoi pour Mitemo. Détail dans `04-infrastructure-services-budget.md`.

---

## Les trois problèmes sérieux mais réparables

### P3 - Le statut réglementaire est esquissé, pas construit

La vision dit « Mitemo n'est pas une banque » et prévoit des comptes miroirs chez un partenaire agréé COBAC. L'intention est juste. Mais un portefeuille interne porteur d'un solde, transférable de gré à gré (§2.6) et retirable vers l'extérieur (§2.5), **est** de la monnaie électronique au sens du cadre CEMAC. Dire « nous ne sommes pas une banque » ne suffit pas : il faut nommer sous quel agrément on opère, et l'architecture diffère selon la réponse. Trois postures possibles, une seule réaliste à court terme - voir `02-conformite-reglementaire.md`.

### P4 - Le grand livre ne boucle pas : règles métier incomplètes

Le §5 exige l'ACID et l'absence de « monnaie virtuelle orpheline ». L'intention est bonne, mais plusieurs règles sont sous-spécifiées au point qu'aucune implémentation ne peut être correcte :

- **§2.5** : la cagnotte vaut `C × (N−1)`. Le document ne dit jamais si le bénéficiaire cotise à son propre tour. Les deux conventions existent dans les tontines réelles, et le choix change le nombre de tours, le total versé par membre et l'équité de l'ordre.
- **§3.1 / §3.2** : la réserve vaut `N × C/2`, un défaut coûte `C`. Elle absorbe donc `N/2` défauts sur tout le cycle. Le document ne dit pas ce qui se passe quand elle est vide, si la garantie **du défaillant** est consommée en premier (elle doit l'être), qui la reconstitue, ni comment elle est restituée à la clôture. Il manque une **cascade d'imputation** explicite.
- **§2.2** : « ANNULER → gel 24 h sans incident de paiement » est, tel qu'écrit, un laissez-passer illimité. Il faut un plafond.
- **§1.3** : la pondération de confiance n'a aucun signal dans un groupe neuf - tout le monde est à zéro, la règle du « dernier tiers » est indéfinie. Et dans la vraie vie l'ordre se négocie (frais de scolarité en septembre, stock avant les fêtes).
- **§1.3** : « algorithme aléatoire vérifiable » est une intention, pas une propriété. Sans protocole nommé, ce n'est pas vérifiable.
- Partout : l'arrondi de la commission n'est pas spécifié. 1,5 % de 37 500 FCFA = 562,5 FCFA, et le FCFA n'a pas de sous-unité pratique.

Correctifs proposés dans `03-architecture-technique.md`.

### P5 - Les scénarios de production manquent

Le cahier des charges décrit le chemin heureux et un seul chemin d'échec (l'impayé). Il manque notamment : perte de téléphone et **SIM swap** (premier vecteur de fraude du mobile money dans la région), disparition ou décès de l'administrateur, décès d'un membre, sortie en cours de cycle, collusion de l'administrateur avec de faux membres, panne opérateur pendant une distribution, fonds « en vol » et réconciliation, exposition d'un membre présent dans cinq tontines, et surtout : **qui arbitre un litige, selon quelle procédure, sous quel délai**. L'état « En Litige » existe dans l'automate mais n'a aucune définition opérationnelle.

Liste complète dans `05-scenarios-et-cas-limites.md`.

---

## Ce que je changerais en priorité, dans l'ordre

| # | Action | Pourquoi maintenant |
|---|---|---|
| 1 | Obtenir par écrit les grilles tarifaires réelles de MTN Congo et Airtel Congo | Tout le modèle économique en dépend. Ne rien arbitrer avant. |
| 2 | Signer une lettre d'intention avec un établissement de microfinance ou un émetteur agréé | Plus de valeur devant un jury que n'importe quelle fonctionnalité. Délai long : à lancer tout de suite. |
| 3 | Ouvrir la négociation d'un code court USSD chez les deux opérateurs | C'est l'élément au plus long délai d'obtention de tout le projet. |
| 4 | Remplacer « dépôt gratuit » par « gratuit à l'intérieur de Mitemo » dans tous les supports | Promesse intenable telle qu'écrite, corrigeable sans rien perdre. |
| 5 | Rendre le portefeuille dépensable (crédit téléphonique, marchands partenaires) | Levier structurel qui répare P1, et accessoirement la barrière à l'entrée des concurrents. |
| 6 | Écrire la cascade d'imputation en cas de défaut et le protocole de tirage vérifiable | Deux pages de spécification qui éliminent la moitié de la dette technique future. |

---

## Note sur le concours

Le document de vision cite le **concours U-Shine Congo 2026**. Je n'ai pas trouvé de trace publique de cet événement - à vérifier de ton côté, c'est peut-être un programme interne ou peu référencé.

En revanche une opportunité parallèle existe, et le calendrier est serré : **INNOV'ACTION GLOBAL GATEWAY**, lancé par la Délégation de l'Union européenne à Brazzaville le 12 octobre 2026. Ouvert aux Congolais de 18 à 35 ans, quatre axes dont le numérique, **candidatures jusqu'au 15 novembre 2026 à minuit**, 12 lauréats primés de 1 à 4,5 millions FCFA et 24 entrepreneurs accompagnés six mois. Mitemo correspond précisément à la thématique inclusion financière. Il reste onze jours.

---

**Sources**
- [Fees & Pricing by Country - PawaPay](https://www.pawapay.io/fees)
- [SMS Pricing in Republic of the Congo - Twilio](https://www.twilio.com/en-us/sms/pricing/cg)
- [API Paiement Mobile Congo-Brazzaville : Guide 2026 - Simiz](https://simiz.io/blog/api-paiement-mobile-congo-orchestrateur)
- [INNOV'ACTION GLOBAL GATEWAY - Délégation de l'UE au Congo](https://www.eeas.europa.eu/delegations/congo-brazzaville/innovaction-global-gateway-lunion-europeenne-mise-sur-le-talent-de-la-jeunesse-congolaise_fr)
