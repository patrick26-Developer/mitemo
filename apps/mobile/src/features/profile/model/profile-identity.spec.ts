import { profileIdentityError } from "./profile-identity";

describe("profileIdentityError", () => {
  const valid = { firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" };

  it("accepte une identité complète", () => {
    expect(profileIdentityError(valid)).toBe("");
  });

  it("signale chaque champ trop court", () => {
    expect(profileIdentityError({ ...valid, firstName: "A" })).toContain("prénom");
    expect(profileIdentityError({ ...valid, lastName: " " })).toContain("nom");
    expect(profileIdentityError({ ...valid, occupation: "" })).toContain("profession");
  });
});
