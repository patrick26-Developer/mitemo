# Règles UX des formulaires et feuilles (mobile)

Imposées par l'utilisateur lors de l'audit UX du 11 novembre 2026.

1. **Feuilles du bas façon Apple, jamais de modales.** Maquettes haute fidélité qui montrent tous les états.
2. **Une feuille qui a une croix n'a pas de bouton « Annuler ».** La croix (« Fermer ») suffit pour renoncer. Concerné et corrigé : déconnexion, modification de l'identité, feuille de confirmation. Un bouton qui vide une recherche n'est pas concerné.
3. **Deux actions = une seule ligne**, côte à côte (`SheetActionRow`) : « Retour » à gauche, action principale à droite. Jamais empilées.
4. **Formulaire long = au moins deux étapes**, avec un indicateur (`StepIndicator`, « Étape 1 sur 3 » et le titre de l'étape). Chaque étape est validée avant la suivante, et l'erreur s'affiche tout de suite. La première étape n'a que « Continuer ». Le récapitulatif est à la dernière étape.
5. **Champ libre à valeurs limitées = liste de choix.** Exemple : fréquence + intervalle d'une tontine deviennent une liste « Chaque jour », « Tous les 2 jours », « Chaque semaine », « Toutes les 2 semaines », « Chaque mois »…
6. **Français correct dans les libellés** : « tous les 2 jours », « toutes les 2 semaines », jamais « chaque 2 jours ».

7. **Les actions d'une feuille vont dans son pied** (`footer` de `BottomSheet`), jamais à la fin du contenu : elles restent visibles au-dessus du clavier.
8. **Un choix ou une date est un vrai champ** : `SheetSelect` déplie sa liste sous le champ, `SheetDateField` déplie le calendrier natif (iOS) ou ouvre le dialogue natif (Android). Jamais de seconde modale, ni de bouton « Valider » ou « Annuler ».
9. **Aucune `Alert`** : une explication ou un échec s'affiche dans une feuille (ou rouvre la feuille concernée avec son message).
10. **Contenu sous un dock** : réserver la hauteur mesurée du dock (`useDockInset`), jamais une marge fixe.

À appliquer à tout nouvel écran et à vérifier dans l'audit de structure des composants avant chaque PR.
