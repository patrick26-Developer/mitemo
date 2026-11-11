import { Test } from "@nestjs/testing";
import request from "supertest";
import { expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module.js";
import { setupOpenApi } from "../src/shared/config/openapi.js";

it("protects Preview documentation and describes the registered API", async () => {
  const key = "test-only-openapi-preview-key-000000";
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("RENDER", undefined);
  vi.stubEnv("MITEMO_DEPLOYMENT", "preview");
  vi.stubEnv("MITEMO_DEMO_AUTH", "true");
  vi.stubEnv("MITEMO_PREVIEW_KEY", key);
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication();
  try {
    setupOpenApi(app);
    await app.listen(0, "127.0.0.1");
    const client = request(app.getHttpServer());
    for (const path of ["/docs", "/docs/", "/docs-json", "/docs/swagger-ui.css"]) {
      await client.get(path).expect(401);
    }
    await client.get("/docs-json").auth("preview", "incorrect").expect(401);
    await client.get("/docs").auth("preview", key).expect(200);
    const response = await client.get("/docs-json").auth("preview", key).expect(200);
    expect(Object.keys(response.body.paths).sort()).toEqual([
      "/auth/login",
      "/auth/refresh",
      "/auth/register",
      "/auth/session",
      "/auth/sessions",
      "/auth/sessions/{id}",
      "/auth/verify",
      "/health",
      "/integrations/pawapay/sandbox/callback",
      "/me",
      "/wallet",
      "/wallet/demo-funding",
      "/wallet/movements",
    ]);
    expect(JSON.stringify(response.body)).not.toContain(key);
  } finally {
    await app.close();
    vi.unstubAllEnvs();
  }
});
