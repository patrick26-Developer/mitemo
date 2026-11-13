import { render, screen } from "@testing-library/react-native";

import { PROFILE_FAQ } from "../../model/model.profile-documents";
import { HelpSheet } from "./sheet.help";

jest.mock("../../api/config.support", () => ({
  supportApi: {
    contact: async () => ({ phoneNumber: "+242065706622", maxAgeSeconds: 86_400 }),
  },
}));

describe("HelpSheet", () => {
  it("propose d'abord de joindre le service client sur WhatsApp ou par téléphone", async () => {
    await render(<HelpSheet />);

    expect(
      screen.getByRole("button", { name: "Écrire au service client sur WhatsApp" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Appeler le service client" })).toBeOnTheScreen();
  });

  it("affiche les questions fréquentes et le contact du support", async () => {
    await render(<HelpSheet />);

    for (const item of PROFILE_FAQ) {
      expect(screen.getByText(item.question)).toBeOnTheScreen();
    }
    expect(screen.getByText("support@mitemo.app")).toBeOnTheScreen();
  });
});
