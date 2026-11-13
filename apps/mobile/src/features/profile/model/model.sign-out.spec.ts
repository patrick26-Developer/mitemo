import { signOutMessage } from "./model.sign-out";

describe("signOutMessage", () => {
  it("s'adresse au membre par son prénom", () => {
    expect(signOutMessage("Grâce MBEMBA")).toMatch(
      /^Nous sommes désolés de vous voir partir, Grâce\./,
    );
  });

  it("reste poli sans prénom", () => {
    expect(signOutMessage("")).toMatch(/^Nous sommes désolés de vous voir partir\./);
  });

  it("rappelle ce que le membre manquerait en partant", () => {
    expect(signOutMessage("Grâce")).toMatch(/rappels de cotisation/);
  });
});
