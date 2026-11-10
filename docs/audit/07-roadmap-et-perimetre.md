# FEUILLE DE ROUTE ET PÉRIMÈTRE PAR PHASE

---

## Phase 0 - Concours et démonstration (maintenant)

Hypothèse : il faut quelque chose de montrable à court terme, avec une équipe réduite et sans argent réel en circulation.

### La règle de cadrage

**Une seule tontine, un seul chemin heureux, un seul chemin d'échec, de bout en bout.** Un parcours complet et crédible bat dix fonctionnalités à moitié faites. Un jury ne teste jamais la largeur ; il teste la profondeur d'un parcours.

### À construire

| Élément | Pourquoi c'est dans le périmètre |
|---|---|
| Création de groupe, invitation par jeton, acceptation | Le cœur du §1.2, et c'est la première impression |
| Blocage des garanties et atteinte du quorum | Montre que le risque est pensé |
| **Tirage vérifiable avec mise en gage et révélation** | Trente secondes de démonstration, effet mémorable, impossible à copier par un opérateur |
| Approvisionnement du portefeuille via un **simulateur d'opérateur** | Permet la démonstration sans intégration réelle ni argent. À construire de toute façon pour les tests (`03` §4.8) |
| Échéance avec arbitrage Accepter / Annuler | La signature du produit (§2.2) |
| Distribution de la cagnotte avec commission et écritures en partie double | Le cœur comptable |
| **Un défaut absorbé par la cascade d'imputation** | Le chemin d'échec. C'est ce qui impressionne, parce que personne ne le montre. |
| Parcours USSD sur simulateur | Prouve l'inclusion des téléphones simples, qui est un pilier de la vision |
| **Tableau de bord de réconciliation et d'intégrité** | « Écart : 0 FCFA, chaîne de hachage valide ». Le détail qui signale le sérieux. |

### À ne pas construire

Interface de scoring, multi-tontines, réseau d'agents, back-office au-delà de la consultation, iOS, paiement marchand, intégration opérateur réelle, et toute fonctionnalité de confort.

### Les livrables sans code, qui valent le plus

Par ordre d'effet de levier décroissant :

1. **Lettre d'intention avec un établissement agréé.** Le plus fort de tous.
2. Mémo de conformité d'une page (`02`).
3. Modèle économique chiffré avec les coûts réels de transaction (`01`).
4. Registre des risques avec mesures d'atténuation.
5. Devis écrits de MTN Congo et Airtel Congo, et demande de code court USSD engagée.
6. Entretiens terrain avec trois présidentes de tontine, documentés.

### Si le concours est à onze jours

Cadrer encore plus serré : la lettre d'intention et les quatre documents ci-dessus, plus une maquette cliquable (Figma) du parcours complet, plus une démonstration en direct du seul tirage vérifiable - qui est le seul élément véritablement original et qui tient dans un script de quelques dizaines de lignes.

**Une maquette honnête accompagnée d'une lettre d'intention bat un prototype fragile sans partenaire.** C'est contre-intuitif pour un développeur, mais c'est ainsi que les jurys arbitrent : ils savent que le code se fait, ils savent que la conformité et les partenariats ne s'improvisent pas.

---

## Phase 1 - Pilote réel (3 à 4 mois après le partenariat)

**Condition de démarrage, non négociable : la convention signée avec l'établissement agréé.** Pas de pilote avec de l'argent réel sans parapluie réglementaire.

### Périmètre

- Un seul marché, 20 groupes, environ 200 membres (voir `06-go-to-market-communication.md`).
- Intégration réelle d'**un seul** opérateur d'abord - celui dont la tarification est la meilleure après négociation.
- Plafonds de palier KYC 0 appliqués strictement.
- USSD en production chez cet opérateur.
- Réconciliation quotidienne avec alerte, surveillée par un humain chaque matin.
- Back-office de support complet, avec double validation sur toute correction manuelle.
- Procédure de litige écrite, publiée, et un délai d'engagement tenu.
- **Mode cahier hybride** (`05` §4.4) : la fonctionnalité au meilleur rapport effort/adoption de tout le projet.

### Préalables obligatoires

- [ ] Test d'intrusion externe réalisé et correctifs appliqués
- [ ] Déclaration du traitement auprès de la CNPD
- [ ] CGU, politique de confidentialité et règlement de groupe validés par un avocat
- [ ] Procédure de ré-enrôlement après changement d'appareil, avec carence
- [ ] Restauration de sauvegarde testée pour de vrai
- [ ] Une personne dédiée au support, identifiée et formée

### Critères de passage en phase 2

| Indicateur | Seuil |
|---|---|
| Groupes bouclant leur premier cycle | ≥ 75 % |
| Groupes relançant un second cycle (le KPI de rétention de la vision) | ≥ 60 % |
| Écart de réconciliation | 0, chaque jour, sans exception |
| Coût de paiement en part du volume | ≤ 2,5 % |
| Taux de rétention de valeur à J+7 | ≥ 30 % |
| Incident de sécurité avec perte de fonds | 0 |

Si le coût de paiement reste au-dessus de 2,5 %, **ne pas passer à l'échelle** : chaque nouvel utilisateur aggraverait la perte. Renégocier ou accélérer la boucle fermée d'abord.

---

## Phase 2 - Viabilité économique et extension (6 à 12 mois)

L'objectif de cette phase n'est pas la croissance : c'est de **rendre l'unité économique positive**. Croître avant cela multiplie la perte.

| Chantier | Effet |
|---|---|
| Second opérateur intégré | Couverture, et levier de négociation tarifaire |
| **Achat de crédit téléphonique depuis le portefeuille** | Premier usage interne, le plus facile à livrer, et souvent commissionné en faveur de Mitemo |
| **Paiement chez les marchands partenaires** | Le verrou concurrentiel, et le levier décisif sur les frais |
| Contrat direct opérateur en remplacement de l'agrégateur | Un point de pourcentage récupéré sur l'encaissement |
| Réseau d'agents de dépôt en espèces | Approvisionnement à ~1 % au lieu de 3-4 %, et résout l'adoption |
| Extension à un deuxième puis troisième marché | Seulement après saturation du premier |
| Micro-assurance décès (`05` §2.2) | Produit utile, différenciant, et commercialement très parlant |

---

## Phase 3 - Scoring et origination de crédit (12 à 24 mois)

C'est ici que la vision se réalise et que la marge apparaît.

- Score à base de règles, explicable, visible et contestable (`03` §3.7).
- Consentement explicite et séparé pour le partage de l'historique (`02` §5).
- Convention d'apport d'affaires avec un ou deux établissements de microfinance, rémunérée sur le montant des crédits octroyés.
- Mesure du troisième KPI de la vision : le taux de bancarisation indirecte.

**Rappel d'architecture :** rien de tout cela n'est possible si la capture d'événements n'a pas été irréprochable depuis la phase 1. C'est la raison pour laquelle le journal immuable est une exigence de phase 1, et non de phase 3.

---

## Ce qu'il ne faut jamais mettre au périmètre

| Tentation | Pourquoi y renoncer |
|---|---|
| Prêter sur fonds propres | La vision l'exclut, à juste titre. Change complètement le régime réglementaire et le profil de risque. |
| Promettre un rendement sur l'épargne | Devient un produit de placement, donc un agrément de plus, et un risque de requalification en système pyramidal. |
| Tontines ouvertes au public | La vision l'exclut explicitement. C'est aussi la porte ouverte à la fraude de masse. |
| Cryptomonnaie ou *blockchain* | Aucun besoin réel ici - le tirage vérifiable se fait avec une simple fonction de hachage. Ajouterait un risque réglementaire majeur pour zéro bénéfice utilisateur. |
| Devenir un opérateur de paiement | C'est l'anti-stratégie de la vision, et elle a raison. |
| Microservices | Voir `03` §4.2. |

---

## Les trois risques qui peuvent tuer le projet

| Risque | Probabilité | Atténuation |
|---|---|---|
| **Aucun partenaire agréé n'accepte** | Moyenne | Approcher trois partenaires en parallèle dès maintenant, dont un opérateur télécom en montage super-marchand. Plan de repli : posture C de `02`, sans portefeuille. |
| **Les frais opérateur restent prohibitifs** | Moyenne à élevée | Boucle fermée, réseau d'agents, répercussion transparente, et négociation d'un tarif « inclusion financière » - argument que le label d'un concours renforce beaucoup |
| **Un incident de fraude en phase pilote** | Moyenne | Plafonds KYC bas, carence au ré-enrôlement, plafonnement des cagnottes sur groupes neufs, revue humaine systématique au-dessus d'un seuil. Un seul vol raconté dans un marché peut arrêter le projet. |

Les deux premiers se traitent par des rendez-vous, pas par du code. C'est pourquoi ils sont en tête de la liste de priorités de `00-synthese-et-points-critiques.md`.
