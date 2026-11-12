# Découpage du code et limites ESLint

Les limites (20 lignes et 10 instructions par fonction, 40 lignes par composant, 5 props, complexité 8) sont un guide de conception, pas un obstacle à contourner.

## Comment on réagit à un dépassement

1. **Chercher la duplication.** Deux hooks de création identiques (tontine et carte) dépassaient la limite : la logique commune est devenue `useStepForm` dans `shared/hooks/`. C'est le « deuxième cas réel » qui justifie l'abstraction (KISS / YAGNI).
2. **Extraire un sous-hook** pour l'état et les effets (`useStepFeedback` : étape courante et erreur).
3. **Extraire une fonction pure** pour la logique (`advanceStepForm`, `completeStepForm`), avec un objet typé en paramètre au-delà de 3 arguments.
4. **Un composant par étape** dans une feuille multi-étapes, choisi par un tableau indexé sur l'étape courante plutôt qu'une cascade de ternaires.

## Ce qu'on s'interdit

- Opérateur virgule ou tableau renvoyé par une flèche pour enchaîner deux appels.
- `return f()` dans une fonction `void` (ESLint JSDoc réclame alors un `@returns`) : écrire un bloc.
- `eslint-disable`.
