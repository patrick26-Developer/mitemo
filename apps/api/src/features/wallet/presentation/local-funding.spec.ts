import { describe, expect, it } from "vitest";
import { localFundingEnabled } from "./local-funding.js";

const LOCAL = {
  NODE_ENV: "development",
  MITEMO_DEMO_AUTH: "true",
  DATABASE_URL: "postgresql://test:test@localhost:5432/mitemo_dev",
};

describe("local simulated funding", () => {
  it("accepts explicitly enabled local development only", () => {
    expect(localFundingEnabled(LOCAL)).toBe(true);
    for (const change of [
      { NODE_ENV: "production" },
      { MITEMO_DEMO_AUTH: "false" },
      { RENDER: "true" },
      { MITEMO_DEPLOYMENT: "preview" },
      { DATABASE_URL: "postgresql://test:test@example.com/mitemo_dev" },
      { DATABASE_URL: "postgresql://test:test@localhost/neondb" },
      { DATABASE_URL: "" },
    ])
      expect(localFundingEnabled({ ...LOCAL, ...change })).toBe(false);
  });
});
