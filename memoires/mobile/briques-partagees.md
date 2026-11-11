# Briques partagées à réutiliser

Avant de créer un composant ou un hook, chercher ici et dans `apps/mobile/src/shared/`.

## Formulaire en plusieurs étapes

| Brique             | Fichier                                           | Rôle                                                                |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------------------- |
| `useStepForm`      | `shared/hooks/hook.step-form.ts`                  | saisie, erreur, étape ; valide chaque étape puis crée à la dernière |
| `useFormSteps`     | `shared/hooks/hook.form-steps.ts`                 | position seule : `next`, `back`, `reset`                            |
| `stepError`        | `shared/model/model.form-steps.ts`                | message d'erreur d'un schéma zod pour une étape, ou `null`          |
| `StepIndicator`    | `shared/components/atoms/indicator.step.tsx`      | segments, titre, « Étape X sur Y », rôle `progressbar` accessible   |
| `SheetActionRow`   | `shared/components/macros/row.sheet-actions.tsx`  | deux actions côte à côte                                            |
| `SheetStepsFooter` | `shared/components/macros/footer.sheet-steps.tsx` | « Continuer » seul, puis « Retour » + action finale sur une ligne   |
| `SheetOptionList`  | `shared/components/macros/list.sheet-option.tsx`  | liste de choix exclusifs dans une feuille                           |

## Feuilles, clavier et docks

| Brique                  | Fichier                                     | Rôle                                                                      |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| `BottomSheet` `footer`  | `shared/components/macros/sheet.bottom.tsx` | actions hors du défilement, toujours visibles au-dessus du clavier        |
| `useFocusedFieldReveal` | `shared/hooks/hook.focused-field-reveal.ts` | ramène le champ actif en haut de la zone visible à l'ouverture du clavier |
| `useKeyboardHeight`     | `shared/hooks/hook.keyboard-height.ts`      | hauteur du clavier, changement animé au rythme du clavier                 |
| `useDockInset`          | `shared/hooks/hook.dock-inset.ts`           | marge basse du contenu = hauteur mesurée du dock                          |

## Paiement et rappels

| Brique            | Fichier                                                     | Rôle                                                                  |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `PinConfirm`      | `features/auth/components/confirm.pin.tsx` (via `index.ts`) | valide une opération avec le code PIN Mitemo du membre                |
| `PAYMENT_METHODS` | `shared/model/model.payment-method.ts`                      | MTN Mobile Money et Airtel Money, avec leurs libellés                 |
| `TontinePaySheet` | `features/tontines/components/sheet.tontine-pay.tsx`        | « Cotiser » : choix de l'opérateur puis code PIN (paiement simulé)    |
| `CardReminders`   | `features/savings/components/sync.card-reminders.tsx`       | push locale « versez depuis votre carte » quand la cotisation est due |

## Recette d'une feuille multi-étapes

1. Dans `model/` : `XXX_FORM_STEPS` (titres `as const`), un schéma zod par étape, `xxxStepError(form, step)` qui utilise le schéma complet à la dernière étape.
2. Dans `hooks/` : un hook d'une dizaine de lignes qui appelle `useStepForm({ initial, total, validateStep, parse, onCreate, onDone })`. L'horloge (`new Date()`) est lue au moment de la validation.
3. Dans `components/` : un composant par étape, `StepIndicator` en tête, `SheetStepsFooter` passé à la prop `footer` de `BottomSheet`, `close` du hook passé à `BottomSheet`.
4. Les tests de la feuille couvrent : ouverture à l'étape 1, blocage avec message, retour qui garde la saisie, création à la dernière étape.

Exemples complets : `features/tontines/components/sheet.tontine-create.tsx` (4 étapes) et `features/savings/components/sheet.savings-create.tsx` (2 étapes).
