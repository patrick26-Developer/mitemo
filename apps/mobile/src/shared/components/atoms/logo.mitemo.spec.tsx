import { render, screen } from "@testing-library/react-native";

import { MitemoLogo } from "./logo.mitemo";

describe("MitemoLogo", () => {
  it("garde les proportions du logo", async () => {
    await render(<MitemoLogo width={151} />);

    expect(screen.getByTestId("mitemo-logo").props).toMatchObject({ width: 151, height: 89 });
  });
});
