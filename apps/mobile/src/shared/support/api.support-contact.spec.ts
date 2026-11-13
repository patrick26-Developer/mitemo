import type { ApiClient } from "../api/client.http";
import { createSupportApi } from "./api.support-contact";

describe("createSupportApi", () => {
  it("demande le contact du service client, sans session", async () => {
    const request = jest.fn(async () => ({ phoneNumber: "+242065706622", maxAgeSeconds: 86_400 }));
    const api = createSupportApi({ request } as unknown as ApiClient);

    await expect(api.contact()).resolves.toEqual({
      phoneNumber: "+242065706622",
      maxAgeSeconds: 86_400,
    });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ method: "GET", path: "/support/contact", auth: false }),
    );
  });
});
