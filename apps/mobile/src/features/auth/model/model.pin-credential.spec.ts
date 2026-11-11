import { createPinCredential, verifyPinCredential } from "./model.pin-credential";
import type { PinDigest } from "./model.pin-credential";

/**
 * Empreinte de test, lisible pour vérifier ce qui a été haché.
 * @param data Chaîne à hacher.
 * @returns La chaîne entourée de « h(...) ».
 */
const fakeDigest: PinDigest = (data) => Promise.resolve(`h(${data})`);

const PHONE = "+242 06 570 6622";

describe("createPinCredential", () => {
  it("ne conserve jamais le code en clair", async () => {
    const credential = await createPinCredential(
      { phone: PHONE, pin: "4821" },
      { digest: fakeDigest, salt: "abc" },
    );

    expect(credential).toEqual({ phone: PHONE, salt: "abc", hash: "h(abc:4821)" });
  });
});

describe("verifyPinCredential", () => {
  const credentialPromise = createPinCredential(
    { phone: PHONE, pin: "4821" },
    { digest: fakeDigest, salt: "abc" },
  );

  it("accepte le bon numéro et le bon code", async () => {
    const credential = await credentialPromise;

    await expect(
      verifyPinCredential(credential, { phone: PHONE, pin: "4821" }, fakeDigest),
    ).resolves.toBe(true);
  });

  it("refuse un mauvais code", async () => {
    const credential = await credentialPromise;

    await expect(
      verifyPinCredential(credential, { phone: PHONE, pin: "0000" }, fakeDigest),
    ).resolves.toBe(false);
  });

  it("refuse un autre numéro, même avec le bon code", async () => {
    const credential = await credentialPromise;

    await expect(
      verifyPinCredential(credential, { phone: "+242 05 555 1234", pin: "4821" }, fakeDigest),
    ).resolves.toBe(false);
  });
});
