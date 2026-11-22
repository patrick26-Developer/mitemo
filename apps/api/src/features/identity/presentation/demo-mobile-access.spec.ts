import { createHmac } from "node:crypto";
import type { ExecutionContext } from "@nestjs/common";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DemoAccessGuard } from "./demo-access.guard.js";

const key = "test-only-preview-key-with-32-characters";
function context(path: string, headers: Record<string, string>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ originalUrl: path, headers }) }),
  } as unknown as ExecutionContext;
}
function admission(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ aud: "mitemo-preview", iat: now, exp: now + 3600 }),
  ).toString("base64url");
  return (
    payload +
    "." +
    createHmac("sha256", key)
      .update("mitemo.preview.admission.v1." + payload)
      .digest("base64url")
  );
}

describe("accès mobile Preview", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("MITEMO_DEPLOYMENT", "preview");
    vi.stubEnv("MITEMO_DEMO_AUTH", "true");
    vi.stubEnv("MITEMO_PREVIEW_KEY", key);
    vi.stubEnv("RENDER", "false");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T15:00:00Z"));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("admet un testeur pour démarrer la connexion sans lui donner la clé serveur", async () => {
    await expect(
      new DemoAccessGuard().canActivate(
        context("/auth/login", { "x-mitemo-preview-admission": admission() }),
      ),
    ).resolves.toBe(true);
  });
  it("ne permet pas d'utiliser l'admission seule pour lire un portefeuille", async () => {
    await expect(
      new DemoAccessGuard().canActivate(
        context("/wallet", { "x-mitemo-preview-admission": admission() }),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });
  it("ne fait pas confiance à la seule présence d'un Bearer", async () => {
    const profile = vi.fn().mockRejectedValue(new UnauthorizedException());
    await expect(
      new DemoAccessGuard({ profile }).canActivate(
        context("/wallet", { authorization: "Bearer fake" }),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });
  it("vérifie la session avant de permettre une route privée sans clé partagée", async () => {
    const profile = vi.fn().mockResolvedValue({});
    await expect(
      new DemoAccessGuard({ profile }).canActivate(
        context("/wallet", { authorization: "Bearer session" }),
      ),
    ).resolves.toBe(true);
    expect(profile).toHaveBeenCalledWith("Bearer session");
  });

  it("reste fermé en production même avec un Bearer et une admission valides", async () => {
    const token = admission();
    vi.stubEnv("MITEMO_DEPLOYMENT", "production");
    const profile = vi.fn().mockResolvedValue({});
    const request = context("/wallet", {
      authorization: "Bearer session",
      "x-mitemo-preview-admission": token,
    });
    await expect(new DemoAccessGuard({ profile }).canActivate(request)).rejects.toThrow(
      NotFoundException,
    );
    expect(profile).not.toHaveBeenCalled();
  });
});
