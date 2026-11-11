import { Share } from "react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { shareInvitation } from "./api.share-invitation";

describe("shareInvitation", () => {
  it("partage le message avec le code et le lien d'invitation", () => {
    const share = jest
      .spyOn(Share, "share")
      .mockResolvedValue({ action: Share.sharedAction, activityType: undefined });

    shareInvitation(makeTontine({ name: "Les Amis" }), "K7P2QX");

    expect(share).toHaveBeenCalledWith({
      message: expect.stringContaining("Lien : mitemo://invitation/K7P2QX") as string,
    });
  });
});
