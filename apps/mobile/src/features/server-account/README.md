# Compte connecté Preview

Ce lot raccorde le parcours prioritaire sans réécrire le client HTTP de #120.
Les composants existants d'Espoir sont conservés ; les routes de compte montent
des vues connectées isolées. Les hooks PIN et numéro existants sont les points
d'intégration communs à coordonner avec `Espoir-Loem` lors de la revue.

## Parcours disponible dans le code

- Inscription serveur avec PIN4 ; connexion serveur ; saisie OTP6 distincte.
- Session opaque dans SecureStore, restauration après validation de `/me`,
  renouvellement par le client existant, déconnexion avec effacement local même
  si la révocation distante échoue.
- Portefeuille : quatre soldes serveur, indicateur explicite de simulation,
  chargement, erreur et nouvel essai. Un échec ne devient jamais un solde nul.
- Historique serveur vide ou paginé, sans reprise de l'historique fictif local.
- Objectifs mensuels : création sans débit et liste paginée du compte connecté.
- Profil : nom public et numéro masqué ; modification du nom après confirmation
  serveur. La profession et la photo ne sont pas annoncées comme synchronisées.

Les parcours locaux non raccordés sont fermés par la navigation connectée. Le
volet tontines annonce son indisponibilité. Aucun bouton de crédit, retrait ou
paiement opérateur ne crédite le portefeuille. PawaPay n'est pas modifié par ce lot.
Le calendrier possède un adaptateur typé ; son affichage détaillé reste à raccorder.
Le serveur et le client HTTP acceptent les anciens PIN6, mais l'écran PIN conservé
dans ce lot reste à quatre chiffres : utiliser un nouveau compte PIN4 pour le test
sur téléphone. La récupération de PIN, la photo et la gestion visuelle des appareils
restent hors de ce parcours.

## Démarrer Expo

Depuis la racine du worktree après installation figée :

```powershell
pnpm --filter @mitemo/contracts build
$env:EXPO_PUBLIC_API_URL = 'https://mitemo-api-dev.onrender.com'
pnpm --filter mobile exec expo start --clear
```

La lecture est statique : `process.env.EXPO_PUBLIC_API_URL`. La déclaration
`environment.d.ts` la rend compatible avec `noPropertyAccessFromIndexSignature`
sans affaiblir TypeScript. Ne pas ajouter de clé Preview ou PawaPay dans Expo.

## Admission testeur

L'API mise à jour doit être déployée avant ce test. L'opérateur émet un code signé
d'une heure avec la clé Preview **déjà configurée côté serveur**, dans un terminal
privé ; aucune valeur secrète n'est inscrite dans la commande ni dans un fichier :

```powershell
$previousKey = $env:MITEMO_PREVIEW_KEY
$previousDeployment = $env:MITEMO_DEPLOYMENT
$secureKey = Read-Host 'Clé serveur Preview, saisie masquée' -AsSecureString
$keyPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
try {
  $env:MITEMO_PREVIEW_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPtr)
  $env:MITEMO_DEPLOYMENT = 'preview'
  node scripts/issue-preview-admission.mjs
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPtr)
  $secureKey.Dispose()
  $env:MITEMO_PREVIEW_KEY = $previousKey
  $env:MITEMO_DEPLOYMENT = $previousDeployment
}
```

Le résultat est lui-même un accès temporaire : le transmettre au testeur de façon
privée, pas dans une PR ou une capture publique. Sur le téléphone, ouvrir « Accès
testeur », coller ce résultat puis enregistrer et fermer la feuille. Ne jamais
saisir la clé serveur dans l'application. Voir [ADR 0006](../../../../../docs/adr/0006-admission-testeur-preview.md).

## Test complet sur téléphone — à exécuter après autorisation du déploiement

1. Vérifier le SHA Live et `/health`. Ouvrir Expo avec un laissez-passer valide.
2. Créer un compte de démonstration avec un numéro de test congolais autorisé,
   un nom et un PIN4. Vérifier que le PIN seul n'ouvre pas le compte.
3. Sur l'écran OTP, constater la mention « simulé ». Essayer un code incorrect,
   puis saisir manuellement les six chiffres affichés. Vérifier l'ouverture du compte.
4. Vérifier le portefeuille : données issues du serveur, simulation signalée,
   aucun crédit introduit par le mobile. Vérifier l'historique, normalement vide.
5. Créer un objectif sans paiement ; vérifier la liste et l'absence de débit.
   Modifier le nom public ; vérifier la réponse puis la persistance après relance.
6. Fermer puis rouvrir l'application sans effacer les données : `/me` doit valider
   la session conservée avant d'ouvrir le portefeuille.
7. Se déconnecter, fermer puis rouvrir : les données privées doivent rester fermées.
   Se reconnecter avec numéro/PIN4, puis OTP6. Retrouver le même compte et ses objectifs.
8. Couper le réseau pendant une lecture : voir un état d'erreur, jamais un faux
   solde ou un succès de paiement. Rétablir le réseau et réessayer.
9. Tester un second compte : aucune identité, aucun mouvement ni objectif du premier.

Ne pas effacer les données d'Expo Go ou d'un autre projet pour ce test. Aucun
paiement ni financement n'est requis pour ce parcours. Les notifications distantes
Android exigent un development build ; elles ne constituent pas un critère de
réussite du parcours Expo Go.

Ce document est un protocole : il ne prouve pas une exécution sur téléphone.
