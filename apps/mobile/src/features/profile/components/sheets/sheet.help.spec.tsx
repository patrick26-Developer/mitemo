import { render, screen } from "@testing-library/react-native";

import { PROFILE_FAQ } from "../../model/model.profile-documents";
import { HelpSheet } from "./sheet.help";

jest.mock("../../model/config.support-contact", () => ({
  SUPPORT_CONTACT: {
    display: "+242 06 570 6622",
    whatsappUrl: "https://wa.me/242065706622",
    callUrl: "tel:+242065706622",
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
