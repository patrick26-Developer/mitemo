# CONFORMITÉ RÉGLEMENTAIRE, KYC, LBC/FT ET DONNÉES PERSONNELLES

> Ce document est une analyse technique de risque, pas un avis juridique. Chaque point marqué **[AVOCAT]** doit être validé par un conseil admis au barreau de Brazzaville et familier du droit bancaire CEMAC avant toute mise en production avec de l'argent réel.

---

## 1. Le problème que la vision ne résout pas encore

Le document de vision affirme :

> *Mitemo n'est pas une banque et ne gère pas de dépôts de manière autonome. Les fonds doivent obligatoirement être hébergés dans des comptes miroirs au sein d'institutions partenaires agréées par la COBAC.*

L'intention est exactement la bonne. Mais elle décrit **où sont les fonds**, pas **qui en est juridiquement responsable**. Or le cahier des charges décrit un portefeuille qui :

- porte un solde créditeur au nom d'un client (§2.1) ;
- est transférable à un tiers de gré à gré (§2.6) ;
- est retirable en monnaie électronique externe (§2.5) ;
- est alimenté par encaissement auprès du public (§2.4).

Ce faisceau est la définition même de l'**émission et de la gestion de monnaie électronique**, et plus largement d'un **service de paiement** au sens du cadre CEMAC - Règlement n° 01/11/CEMAC/UMAC du 18 septembre 2011 relatif à l'exercice de l'activité d'émission de monnaie électronique, et Règlement du 21 décembre 2018 relatif aux services de paiement dans la CEMAC, sous la supervision de la COBAC et de la BEAC.

Autrement dit : **telle que spécifiée, l'activité est réglementée.** La question n'est pas de l'éviter mais de choisir sous quel parapluie l'exercer.

---

## 2. Les trois postures possibles

### Posture A - Prestataire technique d'un établissement agréé **[recommandée]**

Mitemo est un éditeur de logiciel. Un partenaire agréé - établissement de microfinance (EMF) ou émetteur de monnaie électronique - est l'émetteur de droit : il détient les fonds sur un compte de cantonnement, il est le responsable du traitement au sens prudentiel, il porte l'obligation de KYC et de déclaration de soupçon. Le « portefeuille Mitemo » devient techniquement un **sous-compte analytique** du compte global du partenaire.

| Avantages | Inconvénients |
|---|---|
| Mise en marché en mois, pas en années | Dépendance forte à un partenaire |
| Pas d'exigence de capital réglementaire propre | Partage de la marge |
| Le partenaire apporte sa crédibilité et son logo | Le partenaire peut imposer son rythme |
| Prépare naturellement la ligne « apport d'affaires » | Risque de concentration (un seul partenaire) |

C'est la seule posture tenable à l'horizon du concours et des 18 premiers mois. **Action : viser deux partenaires, pas un**, pour ne pas être prisonnier du premier.

Côté partenaires à approcher au Congo : le réseau mutualiste **MUCODEC** est l'acteur de référence de la microfinance congolaise et le plus naturel sur une thématique d'inclusion ; les EMF de catégorie 1 et 2 agréés localement ; et, en alternative, un montage de **super-marchand** avec MTN Congo ou Airtel Congo, qui règle en même temps le problème tarifaire du document `01`.

### Posture B - Agrément propre de prestataire de services de paiement ou d'émetteur

La cible à trois ou cinq ans. Exigences de capital minimum, de gouvernance, de contrôle interne, de dispositif LBC/FT et d'instruction par la COBAC. Hors de portée aujourd'hui et inutile à mentionner autrement que comme trajectoire dans un dossier de concours - où, en revanche, le mentionner comme vision prouve que tu sais où tu vas.

### Posture C - Orchestration sans détention de valeur

Pas de portefeuille du tout. Mitemo organise, notifie, calcule l'ordre de passage, tient le registre - et à chaque échéance l'argent va directement du compte MoMo du cotisant au compte MoMo du bénéficiaire. Juridiquement le plus léger.

Mais cela détruit la proposition de valeur : chaque cotisation devient une transaction MoMo facturée, donc le verrou n° 2 de la vision (« l'attrition par les coûts ») réapparaît intact. **À garder comme plan de repli** si aucun partenariat n'aboutit, et comme mode dégradé pour une démonstration sans argent réel.

---

## 3. Le KYC allégé : bon principe, cadre à écrire

Le §1.2 - « Zéro CNI », authentification par le seul numéro de téléphone adossée à l'enrôlement SIM de l'opérateur - est le bon raisonnement et il est aligné avec les approches de KYC par paliers admises en zone CEMAC. Mais tel qu'écrit il est inopposable : il n'y a aucune contrepartie en termes de plafonds.

### Proposition : trois paliers

| Palier | Vérification | Plafond de solde | Plafond mensuel cumulé | Cas d'usage |
|---|---|---|---|---|
| **0 - Allégé** | Numéro vérifié par OTP + nom déclaré | 100 000 FCFA | 200 000 FCFA | Tontine de marché, cotisations quotidiennes |
| **1 - Standard** | Palier 0 + selfie + une pièce quelconque (CNI, passeport, carte d'électeur, attestation) | 500 000 FCFA | 1 000 000 FCFA | Tontines mensuelles, cagnottes moyennes |
| **2 - Renforcé** | Palier 1 + justificatif d'activité ou d'adresse | Sans plafond applicatif | Selon le partenaire | Éligibilité au crédit, administrateurs de gros groupes |

Trois règles qui en découlent et qui doivent figurer au cahier des charges :

1. **L'administrateur d'une tontine doit être au moins palier 1.** C'est lui qui a le pouvoir d'invitation et donc le pouvoir de créer de faux membres.
2. **Le passage de palier doit être déclenché par le dépassement, pas demandé à l'avance.** On ne bloque jamais quelqu'un qui démarre.
3. **Les plafonds sont consolidés par personne**, pas par tontine. Un membre présent dans cinq tontines cumule son exposition.

### Le point dur : les mineurs **[AVOCAT]**

Le §1.2 indique explicitement que la pièce d'identité n'est pas requise « *pour ne pas exclure les utilisateurs informels ou mineurs* ».

Un mineur ne peut pas valablement s'engager dans un contrat financier. Admettre sciemment des mineurs porteurs d'un solde, d'une garantie bloquée et d'une dette assortie de pénalités est un risque juridique et réputationnel majeur - et c'est le genre de détail qu'un jury attentif ou un partenaire bancaire relève immédiatement.

Deux options propres : supprimer la mention, ou créer un **compte junior rattaché à un représentant légal**, sans garantie bloquée, sans pénalité, avec un plafond bas. La seconde est un bel argument d'éducation financière si elle est assumée et encadrée ; la formulation actuelle, elle, ressemble à une omission.

---

## 4. Lutte contre le blanchiment et le financement du terrorisme

Absent des deux documents, et non négociable dès qu'un partenaire agréé est dans la boucle - c'est lui qui portera l'obligation, et il exigera que l'outil la serve.

À prévoir dès la conception du modèle de données :

- **Filtrage de listes** à l'enrôlement et périodiquement.
- **Surveillance des transactions** par règles : structuration (fractionnement sous les plafonds), vélocité anormale, compte receveur de multiples cagnottes, groupe dont tous les membres partagent un même appareil.
- **Déclaration de soupçon** vers la cellule de renseignement financier nationale, via le partenaire agréé. Le système doit pouvoir produire le dossier, pas juste l'alerte.
- **Conservation des pièces et des traces** pendant la durée légale, et **exportabilité** sur réquisition.
- **Deux typologies de fraude propres à la tontine numérique**, à écrire dès maintenant : l'administrateur qui crée de faux membres pour encaisser plusieurs cagnottes, et le groupe fictif qui sert à faire circuler des fonds entre comptes sous couvert d'épargne collective. Un détecteur simple : corrélation d'appareils, de numéros séquentiels et de dates d'inscription au sein d'un même groupe.

---

## 5. Données personnelles

Le cadre congolais est plus exigeant que ce que les deux documents laissent supposer :

- **Loi n° 29-2019 du 10 octobre 2019** portant protection des données à caractère personnel : traitement conditionné au **consentement exprès**, obligations de transparence et d'information.
- **Loi n° 5-2025 du 29 mars 2025** portant création de la **Commission nationale de protection des données à caractère personnel (CNPD)**, dotée de pouvoirs d'enquête et de sanction, avec des amendes pouvant atteindre **5 % du chiffre d'affaires mondial**.
- Une préférence des autorités pour un **hébergement en zone CEMAC** s'observe en pratique, et les transferts transfrontaliers supposent un niveau de protection suffisant dans le pays destinataire.

### Ce que cela implique concrètement

1. **Se déclarer auprès de la CNPD tôt.** C'est peu coûteux, c'est une obligation, et c'est un actif de crédibilité : très peu de startups locales le font, et le mentionner dans un dossier de concours distingue immédiatement.
2. **Consentement granulaire et traçable.** Le scoring de solvabilité et le partage de l'historique avec une institution de microfinance sont des finalités **distinctes** de la gestion de tontine. Elles exigent un consentement séparé, révocable, et horodaté. On ne peut pas enterrer « nous transmettrons votre historique à nos partenaires » dans des CGU acceptées d'un bloc.
3. **Minimisation.** Le §5 parle de chiffrement des données « d'identification et d'état civil ». La vraie question en amont est : pourquoi collecter de l'état civil pour un service qui revendique le zéro CNI ? Ne collecter que le nécessaire par palier.
4. **Droits des personnes.** Accès, rectification, effacement - avec une limite légitime à documenter : on ne peut pas effacer un grand livre financier. Prévoir la **pseudonymisation** des données personnelles tout en conservant les écritures comptables, et l'écrire dans la politique de confidentialité.
5. **Souveraineté de l'hébergement.** Voir `04-infrastructure-services-budget.md` : la recommandation est un hébergement principal en Europe pour le coût et l'exploitabilité, **plus une copie de conformité en zone CEMAC**, plus un accord de traitement et une base légale de transfert documentée.

---

## 6. Autres points juridiques à cadrer **[AVOCAT]**

| Sujet | Risque | Piste |
|---|---|---|
| Nature juridique du groupe d'épargne | Une tontine numérique est-elle une association de fait, une société créée de fait, un contrat *sui generis* ? Détermine qui est responsable en cas de défaillance collective. | Un règlement de groupe accepté par chaque membre, annexé au contrat-cadre |
| Pénalité de 2 % conservée par la plateforme | Requalification en intérêt, ou en clause pénale abusive | Qualifier en frais de gestion du risque, plafonner en valeur absolue, ne jamais capitaliser |
| Garantie bloquée de `C/2` | S'il est détenu par Mitemo, c'est un dépôt | Cantonnement chez le partenaire agréé, sur un compte distinct du compte de distribution |
| Arbitrage des litiges | L'état « En Litige » du §1.1 n'a aucune procédure | Médiation interne avec délai contractuel, puis clause de recours ; à écrire avant le premier litige, pas après |
| Protection du consommateur de services financiers | Information précontractuelle, affichage des frais, droit de réclamation | Afficher tous les frais avant validation, publier un délai de réponse aux réclamations et le tenir |
| Propriété de la marque « Mitemo » | Dépôt non effectué | Déposer à l'**OAPI** (dépôt unique valable dans les 17 États membres, dont le Congo) avant toute publicité liée au concours |
| Fiscalité | TVA 18 % probablement due sur la commission | Valider avec un fiscaliste et afficher TTC |

---

## 7. Ce qu'il faut produire avant toute mise en production

Checklist, par ordre de délai d'obtention croissant :

- [ ] Dépôt de la marque à l'OAPI
- [ ] Déclaration du traitement auprès de la CNPD
- [ ] Politique de confidentialité et CGU rédigées pour ce cadre précis - pas un modèle européen traduit
- [ ] Règlement de groupe type, accepté membre par membre
- [ ] Lettre d'intention, puis convention, avec l'établissement agréé partenaire
- [ ] Procédure de KYC par paliers formalisée et acceptée par le partenaire
- [ ] Dispositif LBC/FT documenté (règles, seuils, chaîne d'escalade, nommé responsable)
- [ ] Procédure d'arbitrage des litiges avec engagement de délai
- [ ] Convention de code court USSD avec MTN Congo et Airtel Congo
- [ ] Audit de sécurité externe (voir `04`)

---

**Sources**
- [Règlement du 21 décembre 2018 relatif aux services de paiement dans la CEMAC](http://kalieu-elongo.com/wp-content/uploads/2019/05/R%C3%A8glement-du-21-d%C3%A9cembre-2018-relatif-aux-services-de-paiement-dans-la-CEMAC.pdf)
- [Règlement CEMAC n° 04/18 sur les services de paiement - Secrétariat général du Gouvernement](https://www.sgg.cg/txts-droit-reg/cemac-reglement-2018-04-services-paiement.pdf)
- [Rapport sur les services de paiement dans la CEMAC - BEAC](https://www.beac.int/wp-content/uploads/2016/10/RAPPORT-SUR-LES-SERVICES-DE-PAIEMENT-DANS-LA-CEMAC2.pdf)
- [Loi n° 29-2019 du 10 octobre 2019 portant protection des données à caractère personnel - NATLEX/OIT](https://natlex.ilo.org/dyn/natlex2/r/natlex/fe/details?p3_isn=110224)
- [Le Congo renforce sa législation pour protéger les données personnelles](https://www.lafinancedigitale.com/articles/le-congo-renforce-sa-legislation-pour-proteger-les-donnees-personnelles)
- [Republic of Congo - Data Protection Africa](https://dataprotection.africa/republic-of-congo/)
