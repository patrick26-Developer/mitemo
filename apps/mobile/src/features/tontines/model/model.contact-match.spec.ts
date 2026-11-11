import { makeMember } from "../../../shared/testing/fixtures.portfolio";
import { mitemoContacts, toE164 } from "./model.contact-match";

describe("toE164", () => {
  it("met un numéro congolais du répertoire au format international", () => {
    expect(toE164("06 570 66 22")).toBe("+242065706622");
    expect(toE164("+242 05 512 34 56")).toBe("+242055123456");
  });

  it("écarte un numéro invalide", () => {
    expect(toE164("1234")).toBeNull();
  });
});

describe("mitemoContacts", () => {
  const contacts = [
    { name: "Serge Makosso", phone: "05 512 34 56" },
    { name: "Aimée Mbemba", phone: "06 570 66 22" },
    { name: "Aimée (bureau)", phone: "+242 06 570 66 22" },
    { name: "Inconnu", phone: "04 433 22 11" },
    { name: "Déjà là", phone: "06 655 44 33" },
  ];

  it("ne garde que les contacts du répertoire qui ont un compte Mitemo, sans doublon ni membre", () => {
    const result = mitemoContacts({
      contacts,
      accounts: new Set(["+242065706622", "+242055123456", "+242066554433"]),
      members: [{ ...makeMember("m2", "MEMBRE"), phone: "+242066554433" }],
    });

    expect(result).toEqual([
      { name: "Aimée Mbemba", phone: "+242065706622" },
      { name: "Serge Makosso", phone: "+242055123456" },
    ]);
  });
});
