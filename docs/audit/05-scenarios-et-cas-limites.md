# SCÉNARIOS MANQUANTS ET CAS LIMITES

Le cahier des charges couvre le chemin heureux et un seul chemin d'échec : l'impayé (§3.2). C'est déjà plus que la plupart des projets comparables. Mais en production, ce sont les scénarios ci-dessous qui génèrent les litiges, les pertes et les mauvais articles de presse.

Chaque entrée indique le risque, et une piste de traitement. Les lignes **[P1]** doivent être spécifiées avant le pilote avec de l'argent réel.

---

## 1. Identité et accès

### 1.1 Perte, vol ou changement de téléphone **[P1]**

Le plus fréquent de tous, et complètement absent du cahier des charges. Un téléphone dans ce segment change de mains souvent, se perd, se casse.

Traitement : voir §4.6 de `03-architecture-technique.md`. Délai de carence, notification multiple, gel des sorties, revue humaine au-delà d'un seuil.

### 1.2 Échange de carte SIM frauduleux (*SIM swap*) **[P1]**

Premier vecteur de fraude du mobile money dans la région. L'attaquant obtient une SIM au nom de la victime chez un revendeur, puis reçoit tous ses OTP. Comme l'authentification de Mitemo repose **exclusivement** sur le numéro (§1.2), ce scénario donne un accès total.

C'est le prix à payer du choix « zéro CNI », et ce choix reste bon — mais il doit être compensé :

- Liaison forte à l'appareil, et traitement de tout nouvel appareil comme hostile par défaut.
- Interrogation de l'ancienneté de la SIM auprès de l'opérateur quand l'API l'autorise — **à inscrire explicitement dans la négociation du partenariat opérateur**.
- Code secret de récupération remis à l'inscription, hors canal SMS.
- Au-delà d'un seuil de solde, exiger un second facteur non lié au téléphone : un contact de confiance, ou la validation de l'administrateur du groupe.

### 1.3 Changement de numéro volontaire

Fréquent (changement d'opérateur, numéro perdu). Il faut une procédure de migration de compte qui préserve l'historique et le score — sinon l'utilisateur recrée un compte et perd l'actif que vous essayez de construire.

### 1.4 Un téléphone pour plusieurs personnes

Réalité courante : un foyer, un téléphone. Plusieurs membres d'une même tontine peuvent partager un appareil, légitimement.

Conséquence : la détection de fraude « plusieurs comptes sur un appareil » ne peut pas bloquer automatiquement. Elle doit alerter et déclencher une revue, pas suspendre. Un faux positif ici exclut une famille entière.

---

## 2. Gouvernance du groupe

### 2.1 Disparition, incapacité ou décès de l'administrateur **[P1]**

Le cahier des charges fait de l'administrateur un point de défaillance unique : il crée la tontine, il invite. S'il disparaît en cours de cycle, le groupe est bloqué et le cahier des charges ne dit rien.

Traitement : **imposer un co-administrateur dès la création** (obligatoire, pas optionnel), et prévoir une procédure de succession par vote du groupe avec validation par le support Mitemo.

### 2.2 Décès d'un membre

Scénario douloureux mais inévitable, et à traiter avec soin : c'est le moment où la réputation se gagne ou se perd définitivement dans une communauté.

Questions à trancher : que devient sa garantie ? Sa place dans la rotation ? S'il a déjà perçu sa cagnotte, qui honore le reste de ses cotisations ? S'il ne l'a pas perçue, à qui va-t-elle ?

Piste : un état `SUCCESSION`, un gel des obligations, la restitution de la garantie et des cotisations versées à un ayant droit désigné, et la possibilité pour le groupe de voter la prise en charge solidaire du reste. Une **micro-assurance décès** financée par quelques points de la commission est une piste produit forte, à la fois utile et commercialement très parlante dans ce marché.

### 2.3 Sortie d'un membre en cours de cycle **[P1]**

Non traité. Un membre déménage, perd son activité, se brouille avec le groupe.

Deux cas très différents :
- **Il n'a pas encore perçu sa cagnotte** : il est créancier net du groupe. On peut lui rembourser ses cotisations moins une pénalité, ou lui chercher un remplaçant.
- **Il a déjà perçu sa cagnotte** : il est débiteur net. Sa sortie est un défaut organisé. Il ne peut pas sortir sans régler, et la garantie ne couvre qu'une fraction.

Piste : interdire la sortie unilatérale après perception, autoriser le **remplacement par un tiers approuvé par le groupe**, et maintenir la dette comme exigible.

### 2.4 Dissolution volontaire du groupe

Un groupe peut vouloir s'arrêter. Il faut une liquidation ordonnée : solde des positions nettes entre membres (qui a reçu, qui a payé), restitution des garanties, clôture comptable. Sans cette procédure, le groupe se dissout hors de l'application et vous perdez à la fois la relation et l'historique.

### 2.5 Collusion de l'administrateur avec de faux membres **[P1]**

Fraude la plus rentable contre le système : l'administrateur crée six faux membres, le groupe en compte dix, les faux membres occupent les six premiers tours, encaissent, et disparaissent. Les quatre vrais membres perdent tout.

Détection, par faisceau d'indices : numéros séquentiels, inscriptions dans la même minute, un seul appareil, aucun historique antérieur, aucune interaction en dehors du groupe, numéros alimentés depuis un même compte MoMo.

Mesures préventives :
- Administrateur au palier KYC 1 minimum (voir `02-conformite-reglementaire.md`).
- **Plafonnement de la cagnotte pour tout groupe sans historique**, quel que soit le montant demandé.
- Garantie majorée pour les deux premiers bénéficiaires.
- Revue humaine obligatoire au-delà d'un seuil de cagnotte sur un groupe neuf.

### 2.6 Groupe fictif servant à faire circuler des fonds

Variante LBC/FT : une tontine qui n'épargne rien mais fait tourner de l'argent entre comptes sous couvert d'épargne collective. Mêmes indices, traitement différent : déclaration de soupçon via le partenaire agréé, pas simple suspension.

### 2.7 Un membre dans dix tontines simultanément

Non traité. Ses obligations cumulées peuvent largement dépasser sa capacité. Son défaut touche alors dix groupes à la fois.

Traitement : consolider l'exposition **par personne**, afficher le total des engagements à l'utilisateur, plafonner par palier KYC, et avertir le groupe quand un candidat est déjà très engagé — sans révéler ses montants, ce qui serait une violation de sa vie privée. Un simple indicateur de niveau d'engagement suffit.

---

## 3. Flux financiers

### 3.1 Panne opérateur pendant une distribution **[P1]**

Le §2.5 déclenche un virement automatique à l'échéance. Si MoMo est indisponible à cet instant précis, le cahier des charges ne dit rien.

Traitement : la cagnotte est **toujours** créditée au portefeuille interne (opération qui ne peut pas échouer puisque purement comptable), et la sortie externe devient une demande indépendante, réessayable, avec politique de reprise et visibilité pour l'utilisateur. C'est un argument supplémentaire pour supprimer le virement automatique, comme recommandé dans `01-modele-economique.md`.

### 3.2 Fonds en vol et rappels tardifs **[P1]**

Un encaissement initié, confirmé par l'opérateur trois heures plus tard, alors que l'échéance est passée et que la réserve a déjà comblé le manque. Qui est remboursé, dans quel ordre, et avec quelles écritures ?

Traitement : cascade de remboursement inverse (réserve d'abord reconstituée, puis portefeuille du membre), annulation de la pénalité si le retard est imputable à l'opérateur — point important : **un utilisateur ne doit jamais être pénalisé pour une lenteur de l'opérateur**, et il faut pouvoir le prouver, d'où le traçage recommandé en §4.7 de `03`.

### 3.3 Paiement partiel

Un membre dépose 3 000 FCFA sur 5 000 attendus. Le cahier des charges est binaire. Accepte-t-on le partiel ? Est-il compté comme incident ?

Recommandation : **accepter et conserver le partiel au portefeuille**, mais ne valider la cotisation qu'au montant complet. Le partiel est un signal d'effort, pas un échec : il doit améliorer le score de comportement même s'il ne solde pas l'échéance.

### 3.4 Double versement par l'utilisateur

Il appuie deux fois, ou dépose deux fois par inquiétude. Doit créditer le portefeuille sans cotiser deux fois, et être visible et remboursable. Traité par l'idempotence (§1.3 de `03`), à condition qu'elle soit réellement implémentée côté interface aussi.

### 3.5 Retrait du solde libre

Non traité. Un utilisateur a 20 000 FCFA au portefeuille dont 5 000 engagés dans une tontine. Il doit pouvoir retirer les 15 000 libres — et ce retrait coûte ~1 % à Mitemo.

Traitement : distinguer clairement **solde disponible** et **solde engagé** dans l'interface (c'est aussi une exigence de confiance), et prévoir des frais de retrait répercutés ou un seuil de gratuité mensuel.

### 3.6 Arrondis et reliquats **[P1]**

1,5 % de 37 500 FCFA = 562,5 FCFA. Le solde théorique journalier du §2.3 divise rarement juste. Le prorata de restitution de garantie non plus.

Traitement : tout arrondi est explicite, documenté, et son reliquat est **imputé à un compte identifié**. Un franc qui disparaît sans écriture est exactement la « monnaie virtuelle orpheline » que le §5 veut éviter.

### 3.7 Opération contestée

Un membre affirme n'avoir jamais autorisé un transfert. Sans journal d'audit complet (appareil, horodatage, canal, mode d'authentification), c'est sa parole contre la vôtre — et c'est précisément pourquoi l'arbitrage par SMS sans PIN du §4.1 est intenable juridiquement.

---

## 4. Litiges et exploitation

### 4.1 L'état « En Litige » n'a aucune définition **[P1]**

Le §1.1 crée cet état. Rien ne dit qui le déclenche, qui arbitre, selon quels critères, sous quel délai, ni comment on en sort.

À spécifier minimalement :
- **Qui déclenche** : tout membre, ou le système sur détection d'anomalie.
- **Effet immédiat** : gel des distributions, maintien des cotisations, ou gel total ? À trancher — le gel total punit les membres de bonne foi.
- **Qui arbitre** : support Mitemo en première instance ? Vote du groupe ? Quelle légitimité ?
- **Délai d'engagement** : publié et tenu. 72 heures ouvrées est un engagement crédible et défendable.
- **Sortie** : retour en `ACTIVE`, clôture anticipée, ou exclusion d'un membre.
- **Recours** : clause contractuelle de médiation puis de juridiction compétente.

Un produit financier sans procédure de réclamation écrite est un produit non conforme (protection du consommateur de services financiers), et surtout : **le premier litige mal géré se raconte dans tout le marché.**

### 4.2 Correction d'erreur par l'administrateur Mitemo

Il y aura des erreurs à corriger manuellement. C'est aussi le mécanisme par lequel un employé malhonnête vole.

Traitement : double validation obligatoire par deux comptes distincts, motif obligatoire, écriture de contrepartie et jamais de suppression, notification automatique aux membres concernés, et revue périodique de toutes les corrections manuelles.

### 4.3 Groupe inactif

Un groupe en `RECRUTEMENT` qui n'atteint jamais son quorum, avec des garanties déjà bloquées. Il faut une expiration automatique et la restitution des garanties. Sans cela, de l'argent d'utilisateurs reste bloqué indéfiniment — et c'est le type de situation qui fait une plainte.

### 4.4 Migration d'un groupe existant vers Mitemo **[opportunité produit]**

Non traité, et c'est sans doute l'opportunité produit la plus sous-estimée du projet.

Une tontine réelle existe depuis trois ans, au cahier, et veut passer au numérique. Trois obstacles : les membres ne sont pas tous équipés, le cycle est en cours, et l'historique existant est le véritable actif.

**Proposition : un « mode cahier » hybride.** L'administratrice enregistre dans Mitemo les cotisations reçues en espèces pour les membres non encore équipés. L'argent ne passe pas par la plateforme, mais **l'historique est capturé**. Conséquences :

- La barrière à l'adoption tombe à presque zéro : on n'exige plus que tout le monde soit équipé et numérisé le même jour.
- La donnée pour le scoring commence à s'accumuler immédiatement, y compris pour des membres qui ne font aucune transaction.
- Chaque membre a ensuite une raison personnelle de s'équiper, puisqu'il voit son propre historique se construire.
- Et cela fonctionne même là où le réseau et le mobile money ne suivent pas.

Risque à encadrer : une cotisation déclarée mais non reçue. La solution est la confirmation par le membre (par USSD ou dans l'application), ce qui fait du « mode cahier » un **registre à double confirmation** — plus fiable que le cahier papier, qui est le véritable concurrent de Mitemo.

C'est peut-être la fonctionnalité la plus intelligente à ajouter au cahier des charges, et elle ne coûte presque rien à développer.

---

## 5. Récapitulatif par priorité

| Priorité | Scénario | Section |
|---|---|---|
| **P1** | Perte de téléphone et *SIM swap* | 1.1, 1.2 |
| **P1** | Cascade d'imputation en cas de défaut | `03` §3.2 |
| **P1** | Procédure de litige complète | 4.1 |
| **P1** | Collusion administrateur / faux membres | 2.5 |
| **P1** | Fonds en vol et rappels tardifs | 3.2 |
| **P1** | Panne opérateur pendant une distribution | 3.1 |
| **P1** | Sortie d'un membre en cours de cycle | 2.3 |
| **P1** | Arrondis et reliquats | 3.6 |
| P2 | Succession d'administrateur, décès de membre | 2.1, 2.2 |
| P2 | Exposition consolidée multi-tontines | 2.7 |
| P2 | Retrait du solde libre, paiement partiel | 3.5, 3.3 |
| P2 | Groupe inactif, dissolution volontaire | 4.3, 2.4 |
| **Opportunité** | Mode cahier hybride | 4.4 |
| **Opportunité** | Micro-assurance décès | 2.2 |
