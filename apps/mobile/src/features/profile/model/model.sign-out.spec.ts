import { signOutMessage } from "./model.sign-out";

describe("signOutMessage", () => {
  it("garde le prénom à part, pour le mettre en gras", () => {
    expect(signOutMessage("Grâce MBEMBA").firstName).toBe("Grâce");
  });

  it("reste poli sans prénom", () => {
    expect(signOutMessage("").firstName).toBe("");
  });

  it("rappelle ce que le membre manquerait en partant", () => {
    expect(signOutMessage("Grâce").reasons).toMatch(/rappels de cotisation/);
  });
});
