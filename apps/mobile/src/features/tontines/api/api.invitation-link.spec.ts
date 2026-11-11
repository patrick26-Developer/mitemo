import { invitationLink } from "./api.invitation-link";

describe("invitationLink", () => {
  it("ouvre l'invitation dans l'application", () => {
    expect(invitationLink("K7P2QX")).toBe("mitemo://invitation/K7P2QX");
  });
});
