import type { RegistryCommand } from "../domain/registry.repository.js";
import type { RegistryRepository } from "../domain/registry.repository.js";

/** Exécute les opérations du registre via son port persistant. */
export class ExecuteRegistryUseCase {
  /**
   * Initialise le port de persistance.
   * @param repository Registre persistant.
   */
  constructor(private readonly repository: RegistryRepository) {}

  /**
   * Transmet une action déclarative avec l'identité du demandeur.
   * @param command Action authentifiée.
   * @returns Le résultat persistant.
   */
  execute(command: RegistryCommand): Promise<unknown> {
    return this.repository.execute(command);
  }
}
