import { makeMember } from "../../../shared/testing/fixtures.portfolio";
import { splitContacts, toE164 } from "./model.contact-match";

describe("toE164", () => {
  it("met un numéro congolais du répertoire au format international", () => {
    expect(toE164("06 570 66 22")).toBe("+242065706622");
    expect(toE164("+242 05 512 34 56")).toBe("+242055123456");
  });

  it("écarte un numéro invalide", () => {
    expect(toE164("1234")).toBeNull();
  });
});

describe("splitContacts", () => {
  const contacts = [
    { name: "Serge Makosso", phone: "05 512 34 56" },
    { name: "Aimée Mbemba", phone: "06 570 66 22" },
    { name: "Aimée (bureau)", phone: "+242 06 570 66 22" },
    { name: "Clarisse Ngoma", phone: "05 533 77 88" },
    { name: "Numéro faux", phone: "123" },
    { name: "Déjà là", phone: "06 655 44 33" },
  ];

  it("sépare les contacts sur Mitemo des autres, sans doublon, numéro invalide ni membre", () => {
    const result = splitContacts({
      contacts,
      accounts: new Set(["+242065706622", "+242055123456", "+242066554433"]),
      members: [{ ...makeMember("m2", "MEMBRE"), phone: "+242066554433" }],
    });

    expect(result).toEqual({
      onMitemo: [
        { name: "Aimée Mbemba", phone: "+242065706622" },
        { name: "Serge Makosso", phone: "+242055123456" },
      ],
      others: [{ name: "Clarisse Ngoma", phone: "+242055337788" }],
    });
  });
});
