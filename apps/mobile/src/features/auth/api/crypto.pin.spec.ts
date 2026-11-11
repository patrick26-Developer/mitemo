import * as Crypto from "expo-crypto";

import { createSalt, sha256Digest } from "./crypto.pin";

jest.mock("expo-crypto", () => ({
  CryptoDigestAlgorithm: { SHA256: "SHA-256" },
  digestStringAsync: jest.fn(() => Promise.resolve("empreinte")),
  getRandomBytes: jest.fn((count: number) => new Uint8Array(count).fill(171)),
}));

describe("sha256Digest", () => {
  it("demande une empreinte SHA-256 au système", async () => {
    await expect(sha256Digest("sel:4821")).resolves.toBe("empreinte");
    expect(Crypto.digestStringAsync).toHaveBeenCalledWith("SHA-256", "sel:4821");
  });
});

describe("createSalt", () => {
  it("tire seize octets et les écrit en hexadécimal", () => {
    expect(createSalt()).toBe("ab".repeat(16));
    expect(Crypto.getRandomBytes).toHaveBeenCalledWith(16);
  });
});
