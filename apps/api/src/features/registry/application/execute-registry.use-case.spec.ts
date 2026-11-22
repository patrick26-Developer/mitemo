import { describe, expect, it, vi } from "vitest";
import { ExecuteRegistryUseCase } from "./execute-registry.use-case.js";

describe("registre authentifié", () => {
  it("conserve l'identité issue de la session en appelant le port", async () => {
    const execute = vi.fn().mockResolvedValue([{ id: "group" }]);
    const useCase = new ExecuteRegistryUseCase({ execute });
    const command = { actorId: "user", operation: "LIST" } as const;
    await expect(useCase.execute(command)).resolves.toEqual([{ id: "group" }]);
    expect(execute).toHaveBeenCalledWith(command);
  });
});
