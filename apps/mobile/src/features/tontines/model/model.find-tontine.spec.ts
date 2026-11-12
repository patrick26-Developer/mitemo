import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { findTontine } from "./model.find-tontine";

describe("findTontine", () => {
  it("retrouve une tontine suivie, puis celle d'une invitation reçue", () => {
    const followed = makeTontine({ id: "1" });
    const invited = makeTontine({ id: "4" });
    const sources = {
      tontines: [followed],
      invitations: [{ id: "i1", invitedBy: "Mama Nadège", tontine: invited }],
    };

    expect(findTontine(sources, "1")).toBe(followed);
    expect(findTontine(sources, "4")).toBe(invited);
    expect(findTontine(sources, "9")).toBeUndefined();
  });
});
