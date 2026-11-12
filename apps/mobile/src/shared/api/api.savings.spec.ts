import { createSavingsApi } from "./api.savings";

describe("épargne connectée", () => {
  it("lit les objectifs avec la session courante, jamais un identifiant choisi côté mobile", async () => {
    const request = jest.fn().mockResolvedValue({ items: [] });
    await createSavingsApi({ request }).list();
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/savings/goals", auth: true, method: "GET" }),
    );
  });
  it("encode l'identifiant lors de la lecture du calendrier", async () => {
    const request = jest.fn().mockResolvedValue({ items: [] });
    await createSavingsApi({ request }).calendar("a/b");
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/savings/goals/a%2Fb/calendar", auth: true }),
    );
  });
});
