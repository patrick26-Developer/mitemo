import { fireEvent, render, screen } from "@testing-library/react-native";

import { SupportContactSection } from "./section.support-contact";

/** Numéro du service client de test. */
const CONTACT = {
  display: "+242 06 570 6622",
  whatsappUrl: "https://wa.me/242065706622",
  callUrl: "tel:+242065706622",
};

describe("SupportContactSection", () => {
  it("propose d'écrire sur WhatsApp ou d'appeler le service client", async () => {
    const onOpen = jest.fn();
    await render(<SupportContactSection contact={CONTACT} onOpen={onOpen} />);

    await fireEvent.press(
      screen.getByRole("button", { name: "Écrire au service client sur WhatsApp" }),
    );
    await fireEvent.press(screen.getByRole("button", { name: "Appeler le service client" }));

    expect(onOpen).toHaveBeenNthCalledWith(1, CONTACT.whatsappUrl);
    expect(onOpen).toHaveBeenNthCalledWith(2, CONTACT.callUrl);
    expect(screen.getAllByText("+242 06 570 6622")).toHaveLength(2);
  });

  it("ne propose rien tant que le numéro n'est pas configuré", async () => {
    await render(<SupportContactSection contact={null} onOpen={jest.fn()} />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
