import { formatPhone } from "./format.phone";

describe("formatPhone", () => {
  it("affiche un numéro E.164 au format international lisible", () => {
    expect(formatPhone("+242065706622")).toBe("+242 06 570 6622");
  });

  it("rend tel quel un numéro illisible", () => {
    expect(formatPhone("abc")).toBe("abc");
  });
});
