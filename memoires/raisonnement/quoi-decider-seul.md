# Quoi décider seul, quoi demander

## On demande à l'utilisateur

Les choix **produit** qui changent ce que voit le membre et qu'aucune règle ne tranche. Exemples réels :

- option Thème ou Langue non fonctionnelle : la brancher ou la retirer ? (réponse : retirer) ;
- authentification sans API : quel mécanisme ? (réponse : session locale sécurisée, `expo-secure-store`) ;
- créer une issue ou non avant de committer (réponse : oui).

On pose la question avec des options concrètes et une recommandation, puis on n'y revient plus.

## On décide seul, et on le signale dans le compte rendu

- Le découpage technique : nombre d'étapes d'un formulaire, placement d'un champ, nom d'un hook.
  Exemple : la création de tontine passe à **3 étapes** et non 2, parce que la liste de 8 fréquences rendrait une étape trop longue.
- Ce qui découle directement d'une règle de `AGENTS.md` ou d'une règle UX déjà donnée.
- Ce qui reste hors périmètre : on le note comme suite possible, on ne l'implémente pas.

## Toujours

- Respecter les contraintes posées (« ne touche pas `apps/api` ») même quand ce serait plus simple de les enfreindre.
- Signaler les effets de bord d'une décision. Exemple : sans « Annuler », sortir de la modification d'identité ferme toute la feuille.
