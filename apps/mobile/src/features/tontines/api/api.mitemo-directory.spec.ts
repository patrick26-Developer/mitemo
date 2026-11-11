import { findMitemoAccounts } from "./api.mitemo-directory";

describe("findMitemoAccounts", () => {
  it("renvoie, parmi les numéros donnés, ceux qui ont un compte Mitemo", async () => {
    const accounts = await findMitemoAccounts(["+242065706622", "+242044332211"]);

    expect([...accounts]).toEqual(["+242065706622"]);
  });
});
