import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DemoAccessGuard } from "./demo-access.guard.js";

const PREVIEW_KEY = "test-only-preview-key-with-32-characters";

afterEach(() => vi.unstubAllEnvs());

describe("remote demonstration access", () => {
  it("keeps production closed even when the local demo flag is enabled", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MITEMO_DEMO_AUTH", "true");
    vi.stubEnv("MITEMO_DEPLOYMENT", "production");
    vi.stubEnv("MITEMO_PREVIEW_KEY", PREVIEW_KEY);
    expect(() => new DemoAccessGuard().assertAccess(PREVIEW_KEY)).toThrow(NotFoundException);
  });

  it("requires a configured key and rejects missing or incorrect credentials", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MITEMO_DEMO_AUTH", "true");
    vi.stubEnv("MITEMO_DEPLOYMENT", "preview");
    vi.stubEnv("RENDER", "true");
    vi.stubEnv("RENDER_SERVICE_NAME", "mitemo-api-dev");
    vi.stubEnv("DATABASE_URL", "postgresql://localhost/mitemo_preview");
    vi.stubEnv("MITEMO_PREVIEW_KEY", "short");
    const guard = new DemoAccessGuard();
    expect(() => guard.assertAccess("short")).toThrow(NotFoundException);
    vi.stubEnv("MITEMO_PREVIEW_KEY", PREVIEW_KEY);
    expect(() => guard.assertAccess(undefined)).toThrow(UnauthorizedException);
    expect(() => guard.assertAccess("wrong")).toThrow(UnauthorizedException);
    expect(() => guard.assertAccess(PREVIEW_KEY)).not.toThrow();
    vi.stubEnv("RENDER_SERVICE_NAME", "mitemo-api");
    expect(() => guard.assertAccess(PREVIEW_KEY)).toThrow(NotFoundException);
    vi.stubEnv("RENDER_SERVICE_NAME", "mitemo-api-dev");
    vi.stubEnv("DATABASE_URL", "postgresql://localhost/mitemo_production");
    expect(() => guard.assertAccess(PREVIEW_KEY)).toThrow(NotFoundException);
  });
});
