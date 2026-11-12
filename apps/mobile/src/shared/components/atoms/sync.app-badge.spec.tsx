import { render } from "@testing-library/react-native";
import { setBadgeCountAsync } from "expo-notifications";

import { AppBadgeSync } from "./sync.app-badge";

jest.mock("expo-notifications", () => ({
  setBadgeCountAsync: jest.fn(() => Promise.resolve(true)),
}));

describe("AppBadgeSync", () => {
  it("synchronise la pastille sans rien afficher", async () => {
    const { toJSON } = await render(<AppBadgeSync signedIn={false} />);

    expect(toJSON()).toBeNull();
    expect(setBadgeCountAsync).toHaveBeenCalledWith(0);
  });
});
