import { render } from "@testing-library/react-native";

import { useProfilePhotoSync } from "../hooks/use-profile-photo-sync";
import { ProfilePhotoSync } from "./profile-photo-sync";

jest.mock("../hooks/use-profile-photo-sync", () => ({
  useProfilePhotoSync: jest.fn(),
}));

const startSync = jest.mocked(useProfilePhotoSync);

describe("ProfilePhotoSync", () => {
  it("lance la synchronisation partagée sans rien afficher", async () => {
    const { toJSON } = await render(<ProfilePhotoSync />);

    expect(startSync).toHaveBeenCalledTimes(1);
    expect(toJSON()).toBeNull();
  });
});
