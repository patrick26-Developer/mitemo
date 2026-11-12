import { DEMO_MITEMO_ACCOUNTS } from "../../../shared/demo/demo.mitemo-accounts";

/**
 * Cherche, parmi des numéros du répertoire, ceux qui ont un compte Mitemo.
 * Simulé sur les comptes de démonstration tant que l'annuaire du serveur
 * n'est pas branché ; seuls les numéros envoyés reviennent, jamais d'autres.
 * @param phones Numéros au format E.164.
 * @returns Les numéros qui ont un compte Mitemo.
 */
export async function findMitemoAccounts(phones: readonly string[]): Promise<ReadonlySet<string>> {
  const known = new Set(DEMO_MITEMO_ACCOUNTS);
  return Promise.resolve(new Set(phones.filter((phone) => known.has(phone))));
}
