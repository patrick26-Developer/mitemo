import { profileIdentityError, profileIdentityInvalidFields } from "./model.profile-identity";

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

describe("profileIdentityInvalidFields", () => {
  it("signale chaque champ trop court", () => {
    expect(
      profileIdentityInvalidFields({ firstName: "Aimée", lastName: " ", occupation: "" }),
    ).toEqual({ firstName: false, lastName: true, occupation: true });
  });

  it("ne signale rien pour une identité complète", () => {
    expect(
      profileIdentityInvalidFields({
        firstName: "Aimée",
        lastName: "Mbemba",
        occupation: "Commerçante",
      }),
    ).toEqual({ firstName: false, lastName: false, occupation: false });
  });
});
