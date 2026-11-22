import { createMovementsApi } from "./api.movements";

describe("historique serveur", () => {
  it("demande uniquement les mouvements du titulaire de la session", async () => {
    const request = jest.fn().mockResolvedValue({ items: [] });
    await expect(createMovementsApi({ request }).list()).resolves.toEqual({ items: [] });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ method: "GET", path: "/wallet/movements", auth: true }),
    );
  });

  it("encode le curseur sans changer de route", async () => {
    const request = jest.fn().mockResolvedValue({ items: [] });
    await createMovementsApi({ request }).list("a&b");
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/wallet/movements?cursor=a%26b" }),
    );
  });
});
