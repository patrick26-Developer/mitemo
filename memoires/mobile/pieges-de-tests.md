# Pièges de tests connus (Jest + RNTL 14)

- **`render` et `fireEvent` sont asynchrones** avec RNTL 14 : toujours `await`.
- **`getByRole` sur une `View`** ne trouve rien tant que la vue n'a pas `accessible` : un rôle n'est exposé qu'avec `accessible`.
- **Reanimated est simulé** : une interpolation rend toujours la valeur finale. On teste l'état visible, pas l'animation.
- **Gestes (`PanResponder`)** : espionner `jest.spyOn(PanResponder, "create")` et appeler les gestionnaires capturés.
- **`expo-crypto`** est remplacé par `jest/mocks/expo-crypto.js` (`moduleNameMapper`).
- **Horloge** : jamais l'heure système dans un test. Injecter `now` dans le modèle ou simuler `model.clock`.
- **Plantage de Jest** (« Test suite failed to run » ou « Segmentation fault », code 139) sans aucun `FAIL` : c'est l'environnement, pas le code. Relancer. Si c'est un hook Git qui plante, voir [../methode/commits-et-branches.md](../methode/commits-et-branches.md).
- **`tsc` et types utilitaires** : `Required<>` ne retire pas `undefined` des rappels optionnels avec `exactOptionalPropertyTypes` ; utiliser un type mappé avec `NonNullable`.
