import {
  DEMO_PIN,
  PIN_LENGTH,
  formatPhoneInput,
  isValidDemoPin,
  isValidPersonName,
  isValidPin,
  isValidPhoneDigits,
  keepPhoneDigits,
  signUpError,
  toInternationalPhone,
} from "./auth-form";

describe("keepPhoneDigits", () => {
  it("ne garde que les neuf chiffres utiles", () => {
    expect(keepPhoneDigits("06 570 66 22")).toBe("065706622");
    expect(keepPhoneDigits("06a570b66 22 99")).toBe("065706622");
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

describe("isValidPersonName", () => {
  it("exige au moins deux caractères utiles", () => {
    expect(isValidPersonName(" A ")).toBe(false);
    expect(isValidPersonName("Aimée")).toBe(true);
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

describe("isValidDemoPin", () => {
  it("accepte uniquement le code de démonstration", () => {
    expect(isValidDemoPin(DEMO_PIN)).toBe(true);
    expect(isValidDemoPin("0000")).toBe(false);
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
