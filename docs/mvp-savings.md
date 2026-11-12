# Épargne individuelle

Routes sans préfixe. Envoyer Authorization: Bearer <accessToken> et, en Preview, X-Mitemo-Preview-Key. Pour les requêtes JSON, envoyer Content-Type: application/json.

Créer avec POST /savings/goals.

```json
{
  "name": "Fournitures",
  "terms": {
    "installmentAmount": { "amount": "500", "currency": "XAF" },
    "frequency": "MONTHLY",
    "installmentsPerCycle": 3,
    "cycleCount": 1,
    "startsAt": "2026-11-30T00:00:00.000Z"
  }
}
```

La réponse 201 contient goalId, name, terms, createdAt et target, soit 1 500 XAF dans cet exemple.

| Route | Réponse 200 |
| --- | --- |
| GET /savings/goals | items, puis nextCursor si une autre page existe. Renvoyer ce curseur dans ?cursor= |
| GET /savings/goals/:id | Objectif individuel |
| GET /savings/goals/:id/calendar | items avec index, dueAt, amount et state |
| GET /savings/goals/:id/contributions | items vide dans le lot prévisionnel |

La carte de pointage affiche le calendrier. Les échéances sont classées par jour UTC. En fréquence mensuelle, un jour absent est ramené au dernier jour du mois, en conservant le jour d’origine pour le mois suivant. Les bornes techniques sont de 366 échéances et 1 milliard de XAF par échéance.

Ce lot ne crée aucun débit ni frais. La cotisation confirmée, les frais, l’annulation et la sortie des fonds requièrent des règles explicites. Le raccordement à une tontine appartient à un lot distinct.
