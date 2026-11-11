# MODÈLE ÉCONOMIQUE - DIAGNOSTIC ET RECONSTRUCTION

---

## 1. Le constat tarifaire

Hypothèses à confirmer par devis écrit auprès de MTN Congo et Airtel Congo. Les chiffres ci-dessous sont des ordres de grandeur de marché, pas des tarifs contractuels.

| Opération | Via agrégateur international | En direct opérateur (négocié) |
|---|---|---|
| Encaissement (*collection*) | 3 % opérateur + 1 % agrégateur = **~4 %** | **~1,5 à 2,5 %** |
| Décaissement (*payout*) | **~1 %** | **~0,5 à 1 %** |
| SMS A2P | 23 à 56 FCFA | 8 à 20 FCFA |
| Transfert interne Mitemo | **0** | **0** |

Deux enseignements immédiats :

1. **L'agrégateur coûte un point de pourcentage sur l'encaissement.** Utile au démarrage pour l'intégration unique (CinetPay, PawaPay, Flutterwave, ou les acteurs locaux OpenPay / Simiz / Wazo Pay), mais à remplacer par un contrat direct dès que le volume le justifie. Prévoir l'architecture pour que ce soit un simple changement d'adaptateur.
2. **Les frais sont proportionnels, pas forfaitaires.** Regrouper les cotisations ne réduit donc rien. Le seul levier est de **réduire le volume qui traverse MoMo**.

---

## 2. Le levier principal : la boucle fermée

C'est la correction la plus importante à apporter au projet, et elle est autant stratégique que financière.

Aujourd'hui le flux est ouvert : l'argent entre par MoMo (−4 %), circule gratuitement en interne, et sort par MoMo (−1 %). Chaque franc épargné est taxé deux fois par l'opérateur. Le §2.5 aggrave le problème en déclenchant **automatiquement** un virement externe vers le compte MoMo du bénéficiaire : on paie pour faire sortir l'argent qu'on va devoir faire rentrer de nouveau au tour suivant.

### Correctif immédiat, à coût nul

**Supprimer le virement automatique du §2.5, étape 3.** Créditer le portefeuille interne du bénéficiaire et le laisser décider. Le bénéficiaire qui garde sa cagnotte dans Mitemo finance ses propres cotisations suivantes sans aucun passage par MoMo. Un seul paramètre par défaut change, et le coût de décaissement s'effondre.

### Correctif structurel : rendre le portefeuille dépensable

Si la seule chose qu'on puisse faire du solde Mitemo est de le retirer, tout le monde le retire. Il faut des usages internes :

| Usage | Difficulté | Effet |
|---|---|---|
| Achat de crédit téléphonique / forfaits data | Faible - API opérateur, souvent avec commission **reversée** à Mitemo | Usage universel, premier à livrer |
| Transfert P2P interne (déjà prévu §2.6) | Déjà au cahier des charges | Garde l'argent dans le réseau |
| Paiement chez des marchands partenaires du marché | Moyenne - nécessite un recrutement terrain | Le vrai verrou concurrentiel |
| Paiement de factures (eau, électricité, scolarité) | Moyenne à élevée - conventions | Forte valeur d'usage |

Ce n'est pas une fonctionnalité secondaire : **c'est ce qui rend le modèle rentable**, et c'est aussi ce qui le rend difficile à copier. Un opérateur télécom peut baisser ses frais du jour au lendemain ; il ne peut pas vous retirer un réseau de 200 commerçantes qui acceptent votre solde au Marché Total.

### Correctif structurel : le dépôt en espèces par agent

Le cœur de cible manipule du liquide. Lui demander de passer par MoMo pour alimenter son portefeuille, c'est lui imposer un aller-retour et −4 %. Un réseau d'agents de proximité (une boutique, une commerçante de confiance par zone) qui encaisse du cash et crédite le portefeuille coûte une commission d'agent de l'ordre de 1 %, soit **le quart du coût MoMo**, et résout en même temps le problème d'adoption.

C'est un chantier opérationnel lourd (gestion de la liquidité des agents, risque de fraude, formation) : à planifier en phase 2, mais à inscrire dès maintenant dans l'architecture - un agent est un type de compte avec un solde de flottant, pas une rustine.

### Effet chiffré

Même tontine, avec 60 % de la cagnotte conservée dans l'écosystème et un contrat direct opérateur à 2 % / 0,75 % :

| Poste | Scénario document actuel | Scénario boucle fermée |
|---|---|---|
| Volume encaissé via MoMo | 450 000 | 180 000 |
| Coût encaissement | −18 000 (4 %) | −3 600 (2 %) |
| Volume décaissé via MoMo | 443 250 | 177 300 |
| Coût décaissement | −4 433 (1 %) | −1 330 (0,75 %) |
| Coût notifications | −14 000 (SMS) | −500 (push + USSD) |
| **Coût total** | **−36 433** | **−5 430** |
| Recette à 1,5 % | +6 750 | +6 750 |
| **Résultat** | **−29 683** | **+1 320** |

On passe d'une perte de 6,6 % du volume à un équilibre légèrement positif. L'équilibre reste fragile : d'où la section suivante.

---

## 3. Reconstruire la grille tarifaire

La commission de 1,5 % sur la cagnotte ne doit pas être l'unique source de revenu. Quatre lignes, dans l'ordre de leur marge réelle :

### Ligne 1 - Commission de cycle (volume, marge faible)

Garder le principe, mais :

- **Passer à 2 %** si la boucle fermée n'est pas encore en place, et redescendre à 1,5 % quand elle l'est. Un argument commercial, « nos frais baissent à mesure que le réseau grandit », est plus fort qu'un tarif bas et insoutenable.
- **Spécifier l'arrondi** : commission arrondie au multiple de 5 FCFA supérieur, calculée en entiers de FCFA. Jamais de flottant dans le grand livre.
- **Afficher le montant exact avant validation**, à chaque fois. Dans ce marché, un frais surprise est un article de presse.

### Ligne 2 - Répercussion transparente du coût d'approvisionnement (neutre)

Ne plus promettre le dépôt gratuit. Afficher à l'écran, avant confirmation : *« Dépôt de 5 000 FCFA - frais opérateur 100 FCFA - crédité : 4 900 FCFA. Gratuit si vous déposez en espèces chez un agent Mitemo. »*

C'est honnête, c'est défendable devant un régulateur, et cela devient un argument de vente pour le canal agent. La promesse « 0 frais » doit être recentrée sur ce qui est vrai et vérifiable : **à l'intérieur de Mitemo, tout est gratuit** - cotiser, recevoir sa cagnotte, transférer à un autre membre.

### Ligne 3 - Pénalités et frais d'incident (faible volume, à cadrer juridiquement)

La pénalité forfaitaire de 2 % du §3.2 est conservable, mais elle doit être qualifiée de **frais de gestion du risque** et non d'intérêt, sous peine de requalification. Elle doit aussi être plafonnée en valeur absolue, et jamais capitalisée.

### Ligne 4 - Apport d'affaires aux institutions financières (marge forte, à 18-24 mois)

C'est là qu'est la vraie rentabilité, et c'est déjà dans la vision. Un établissement de microfinance paie volontiers une commission d'apport de **1 à 3 % du montant du crédit octroyé** pour un dossier pré-qualifié par un historique d'assiduité de douze mois. Un seul crédit de 500 000 FCFA rapporte autant que dix cycles de tontine complets.

Conséquence sur les priorités : **la capture de données doit être parfaite dès le jour 1, même si le scoring n'est livré qu'en phase 3.** Tout événement d'assiduité doit être horodaté, immuable et exportable. C'est un choix d'architecture, pas de produit.

### Ligne non recommandée - le produit du flottant

Les soldes dormants placés produisent un rendement. Dans le cadre CEMAC, l'affectation de ce produit pour un émetteur de monnaie électronique est contrainte et, selon le montage retenu, il peut revenir au partenaire agréé et non à Mitemo. À ne pas inscrire au plan d'affaires sans avis juridique.

---

## 4. Points de vigilance sur le plan d'affaires

- **La TVA.** Le taux de droit commun au Congo est de 18 %. La commission de service y est selon toute vraisemblance assujettie. Si tu annonces 1,5 % TTC, tu encaisses 1,27 % net. Vérifier avec un fiscaliste, et afficher TTC côté utilisateur.
- **La garantie de 2 500 FCFA est un frein à l'adoption.** Demander la moitié d'une cotisation d'avance à quelqu'un dont la cotisation hebdomadaire représente une part significative du revenu est la première raison de ne pas s'inscrire. Trois alternatives à tester : la constituer progressivement sur les premières cotisations, la rendre paramétrable par le groupe (le groupe choisit son niveau de risque), ou la remplacer par une caution sociale (celui qui invite se porte garant). À arbitrer par test terrain, pas en réunion.
- **Le défaut sur le premier tour.** Celui qui reçoit la cagnotte au tour 1 a encaissé `C × (N−1)` et ne doit plus que des cotisations. C'est le moment de risque maximal du cycle, et une garantie de `C/2` ne le couvre pas du tout. Le §1.3 l'a compris en voulant écarter les profils risqués des premiers tours ; il faut aller plus loin et prévoir une garantie majorée pour les deux premiers bénéficiaires, ou un plafond de cagnotte pour un groupe sans historique.
- **Le coût d'acquisition se mesure par groupe, pas par utilisateur.** Un groupe activé vaut 10 à 20 utilisateurs. Tout le pilotage marketing doit être recalé sur cette unité (voir `06-go-to-market-communication.md`).
- **Le vrai coût caché, c'est le support.** Un produit financier dans ce segment génère énormément d'appels : « où est mon argent », « j'ai changé de numéro », « le groupe me doit ». Budgéter une personne au support bien avant de budgéter un deuxième développeur.

---

## 5. Métriques à suivre (en complément des trois KPI de la vision)

Les trois KPI du document de vision (rétention de groupe, volume d'épargne sécurisée, bancarisation indirecte) sont les bons indicateurs d'impact. Il manque les indicateurs de survie :

| Indicateur | Pourquoi | Seuil d'alerte |
|---|---|---|
| **Coût de paiement en % du volume** | Détecte la dérive de P1 | > 2 % |
| **Taux de rétention de valeur** (part de la cagnotte non retirée à J+7) | Mesure directe de la boucle fermée | < 40 % |
| **Notifications envoyées par utilisateur actif et par mois** | Le poste de coût qui dérape sans bruit | > 10 SMS |
| **Taux de complétion du 1er cycle** | Seul vrai signal de *product-market fit* | < 70 % |
| **Écart de réconciliation quotidien** | Doit être strictement nul, toujours | ≠ 0 |
| **Taux de défaut par rang de passage** | Valide ou invalide l'algorithme du §1.3 | - |
| **Coût d'acquisition par groupe activé** | L'unité économique réelle | - |
