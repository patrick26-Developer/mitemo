import { render, screen } from "@testing-library/react-native";
import { Users } from "lucide-react-native";

import { FactPillIcon } from "./icon.fact-pill";

describe("FactPillIcon", () => {
  it("pose l'icône dans une pastille claire", async () => {
    await render(<FactPillIcon icon={Users} testID="fact-icon" />);

    expect(screen.getByTestId("fact-icon")).toBeOnTheScreen();
  });
});
