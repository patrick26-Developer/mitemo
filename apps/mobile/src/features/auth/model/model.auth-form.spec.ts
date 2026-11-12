import {
  PIN_LENGTH,
  SIGN_UP_STEPS,
  formatPhoneInput,
  isValidPin,
  isValidPhoneDigits,
  editPhoneDigits,
  signUpError,
  signUpInvalidFields,
  toInternationalPhone,
} from "./model.auth-form";

describe("editPhoneDigits", () => {
  it("retire l'indicatif +242 tapé ou collé par le membre", () => {
    expect(editPhoneDigits("", "+242 06 570 66 22")).toBe("065706622");
    expect(editPhoneDigits("", "+242065706622")).toBe("065706622");
    expect(editPhoneDigits("", "242 06 570 66 22")).toBe("065706622");
    expect(editPhoneDigits("", "+242")).toBe("");
  });

  it("garde un numéro local qui commence comme l'indicatif", () => {
    expect(editPhoneDigits("", "242")).toBe("242");
    expect(editPhoneDigits("24", "242 1")).toBe("2421");
  });

  it("efface le chiffre placé avant l'espace que le membre supprime", () => {
    expect(editPhoneDigits("065706622", "06570 66 22")).toBe("05706622");
    expect(editPhoneDigits("065706622", "06 570 6622")).toBe("06570622");
  });

  it("efface n'importe quel chiffre, au milieu comme à la fin", () => {
    expect(editPhoneDigits("065706622", "06 50 66 22")).toBe("06506622");
    expect(editPhoneDigits("065706622", "06 570 66 2")).toBe("06570662");
  });

  it("ne garde que neuf chiffres", () => {
    expect(editPhoneDigits("", "06 570 66 22 99")).toBe("065706622");
  });
});

describe("formatPhoneInput", () => {
  it("groupe les chiffres comme la maquette", () => {
    expect(formatPhoneInput("065706622")).toBe("06 570 66 22");
    expect(formatPhoneInput("0657")).toBe("06 57");
    expect(formatPhoneInput("")).toBe("");
  });
});

describe("toInternationalPhone", () => {
  it("ajoute l'indicatif congolais et formate le numéro", () => {
    expect(toInternationalPhone("065706622")).toBe("+242 06 570 6622");
  });
});

describe("isValidPhoneDigits", () => {
  it("accepte un numéro congolais complet", () => {
    expect(isValidPhoneDigits("065706622")).toBe(true);
  });

  it("rejette un numéro incomplet ou invalide", () => {
    expect(isValidPhoneDigits("0657")).toBe(false);
    expect(isValidPhoneDigits("123456789")).toBe(false);
  });
});

describe("isValidPin", () => {
  it(`exige exactement ${PIN_LENGTH} chiffres`, () => {
    expect(isValidPin("1234")).toBe(true);
    expect(isValidPin("123")).toBe(false);
    expect(isValidPin("12345")).toBe(false);
    expect(isValidPin("abcd")).toBe(false);
  });
});

describe("signUpError", () => {
  const valid = {
    firstName: "Aimée",
    lastName: "Mbemba",
    occupation: "Commerçante",
    digits: "065706622",
  };

  it("valide le prénom, le nom, la profession puis le numéro", () => {
    expect(signUpError({ ...valid, firstName: "A" })).toContain("prénom");
    expect(signUpError({ ...valid, lastName: "" })).toContain("nom");
    expect(signUpError({ ...valid, occupation: " " })).toContain("profession");
    expect(signUpError({ ...valid, digits: "123" })).toContain("numéro");
  });

  it("accepte une identité complète", () => {
    expect(signUpError(valid)).toBe("");
  });
});

describe("signUpInvalidFields", () => {
  it("signale chaque champ qui ne respecte pas sa règle", () => {
    expect(
      signUpInvalidFields({
        firstName: "A",
        lastName: "Mbemba",
        occupation: " ",
        digits: "123",
      }),
    ).toEqual({ firstName: true, lastName: false, occupation: true, digits: true });
  });

  it("ne signale aucun champ d'une saisie complète", () => {
    expect(
      signUpInvalidFields({
        firstName: "Aimée",
        lastName: "Mbemba",
        occupation: "Commerçante",
        digits: "065706622",
      }),
    ).toEqual({ firstName: false, lastName: false, occupation: false, digits: false });
  });
});

describe("SIGN_UP_STEPS", () => {
  it("découpe l'inscription en deux étapes : l'identité puis le code", () => {
    expect(SIGN_UP_STEPS).toEqual(["Votre identité", "Votre code PIN"]);
  });
});
