import { Contact, requestPermissionsAsync } from "expo-contacts";

import { readDeviceContacts } from "./api.device-contacts";

jest.mock("expo-contacts", () => ({
  requestPermissionsAsync: jest.fn(),
  Contact: { getAllDetails: jest.fn() },
  ContactField: { FULL_NAME: "fullName", PHONES: "phones" },
}));

describe("readDeviceContacts", () => {
  it("signale un accès refusé au répertoire", async () => {
    jest.mocked(requestPermissionsAsync).mockResolvedValue({ granted: false } as never);

    expect(await readDeviceContacts()).toEqual({ status: "denied" });
  });

  it("aplatit chaque numéro de chaque contact", async () => {
    jest.mocked(requestPermissionsAsync).mockResolvedValue({ granted: true } as never);
    jest.mocked(Contact.getAllDetails).mockResolvedValue([
      {
        id: "1",
        fullName: "Aimée Mbemba",
        phones: [{ number: "06 570 66 22" }, { number: "05 512 34 56" }],
      },
      { id: "2", fullName: null, phones: [{ number: "04 433 22 11" }] },
      { id: "3", fullName: "Sans numéro", phones: [] },
    ] as never);

    expect(await readDeviceContacts()).toEqual({
      status: "granted",
      contacts: [
        { name: "Aimée Mbemba", phone: "06 570 66 22" },
        { name: "Aimée Mbemba", phone: "05 512 34 56" },
        { name: "04 433 22 11", phone: "04 433 22 11" },
      ],
    });
  });
});
