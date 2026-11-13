import { parseSupportContact } from "./model.support-contact";

describe("parseSupportContact", () => {
  it("prépare le lien WhatsApp et l'appel d'un numéro congolais valide", () => {
    expect(parseSupportContact("+242 06 570 6622")).toEqual({
      display: "+242 06 570 6622",
      whatsappUrl: "https://wa.me/242065706622",
      callUrl: "tel:+242065706622",
    });
  });

  it("accepte un numéro national, rattaché au Congo", () => {
    expect(parseSupportContact("05 123 4567")?.callUrl).toBe("tel:+242051234567");
  });

  it("refuse une variable absente, vide ou illisible", () => {
    expect(parseSupportContact(undefined)).toBeNull();
    expect(parseSupportContact("")).toBeNull();
    expect(parseSupportContact("appelez-nous")).toBeNull();
    expect(parseSupportContact("+242 12")).toBeNull();
  });
});
