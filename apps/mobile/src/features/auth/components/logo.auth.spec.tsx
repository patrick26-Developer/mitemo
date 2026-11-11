import { render, screen } from "@testing-library/react-native";

import { AuthLogo } from "./logo.auth";

describe("AuthLogo", () => {
  it("garde les proportions du logo", async () => {
    await render(<AuthLogo width={151} />);

    expect(screen.getByTestId("auth-logo").props).toMatchObject({ width: 151, height: 89 });
  });
});
