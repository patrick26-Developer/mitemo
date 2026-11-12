import { render, screen } from "@testing-library/react-native";

import { CountBadge } from "./badge.count";

describe("CountBadge", () => {
  it("affiche le compteur dans une pastille", async () => {
    await render(<CountBadge label="9+" />);

    expect(screen.getByTestId("count-badge")).toHaveTextContent("9+");
  });
});
