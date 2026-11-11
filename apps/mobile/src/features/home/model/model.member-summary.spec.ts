import { memberSummaryRows } from "./model.member-summary";

describe("memberSummaryRows", () => {
  it("liste le nom complet, le téléphone, la profession et la date de création", () => {
    expect(
      memberSummaryRows({
        name: "Espoir LOEMBA",
        phone: "+242 06 570 6622",
        occupation: "Développeur",
        createdAt: "2026-03-12",
      }),
    ).toEqual([
      { kind: "name", label: "Nom complet", value: "Espoir LOEMBA" },
      { kind: "phone", label: "Téléphone", value: "+242 06 570 6622" },
      { kind: "occupation", label: "Profession ou formation", value: "Développeur" },
      { kind: "createdAt", label: "Compte créé le", value: "12/03/2026" },
    ]);
  });

  it("signale un champ encore vide", () => {
    const rows = memberSummaryRows({
      name: "Espoir LOEMBA",
      phone: "+242 06 570 6622",
      occupation: "  ",
      createdAt: "2026-03-12",
    });

    expect(rows[2]?.value).toBe("Non renseignée");
  });
});
