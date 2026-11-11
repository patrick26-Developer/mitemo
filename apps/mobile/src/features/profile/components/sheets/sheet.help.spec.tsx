import { render, screen } from "@testing-library/react-native";

import { PROFILE_FAQ } from "../../model/model.profile-documents";
import { HelpSheet } from "./sheet.help";

describe("HelpSheet", () => {
  it("affiche les questions fréquentes et le contact du support", async () => {
    await render(<HelpSheet />);

    for (const item of PROFILE_FAQ) {
      expect(screen.getByText(item.question)).toBeOnTheScreen();
    }
    expect(screen.getByText("support@mitemo.app")).toBeOnTheScreen();
  });
});
