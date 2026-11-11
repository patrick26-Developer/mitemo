import { describe, expect, it, vi } from "vitest";
import { runPreviewMigration } from "./preview-migrate.js";

const host = "ep-frosty-tree-be1lox57.example.aws.neon.tech";
const valid = {
  MITEMO_DEPLOYMENT: "preview",
  MITEMO_DEMO_AUTH: "true",
  MITEMO_PREVIEW_KEY: "test-only-migration-preview-key-000000",
  MITEMO_PREVIEW_DB_HOST: host,
  MITEMO_PREVIEW_DB_NAME: "neondb",
  DATABASE_URL: "postgresql://example:synthetic-password@" + host + "/neondb?sslmode=verify-full",
};

describe("Preview migration", () => {
  it("runs Prisma exactly once for the pinned target", () => {
    const migrate = vi.fn(() => true);
    expect(runPreviewMigration(valid, migrate)).toBe("success");
    expect(migrate).toHaveBeenCalledExactlyOnceWith(valid);
  });

  it.each([
    { MITEMO_DEPLOYMENT: undefined },
    { MITEMO_DEMO_AUTH: "false" },
    { MITEMO_PREVIEW_KEY: "short" },
    { MITEMO_PREVIEW_DB_HOST: undefined },
    { MITEMO_PREVIEW_DB_NAME: "other" },
    { DATABASE_URL: undefined },
    { DATABASE_URL: valid.DATABASE_URL.replace("verify-full", "require") },
    { DATABASE_URL: valid.DATABASE_URL + "&sslmode=disable" },
    { DATABASE_URL: valid.DATABASE_URL.replace("/neondb?", "/another?") },
    { DATABASE_URL: valid.DATABASE_URL.replace(host, "localhost") },
    { DATABASE_URL: valid.DATABASE_URL.replace(host, "ep-other.example.aws.neon.tech") },
    {
      DATABASE_URL: valid.DATABASE_URL.replace(host, "ep-other.example.aws.neon.tech"),
      MITEMO_PREVIEW_DB_HOST: "ep-other.example.aws.neon.tech",
    },
    { NODE_TLS_REJECT_UNAUTHORIZED: "0" },
  ])("refuses an invalid target without launching Prisma (%#)", (override) => {
    const migrate = vi.fn();
    expect(runPreviewMigration({ ...valid, ...override }, migrate)).toBe("invalid-target");
    expect(migrate).not.toHaveBeenCalled();
  });

  it("reports a subprocess failure without relaying its exception or credentials", () => {
    expect(runPreviewMigration(valid, () => false)).toBe("migration-failed");
    expect(
      runPreviewMigration(valid, () => {
        throw new Error(valid.DATABASE_URL);
      }),
    ).toBe("migration-failed");
  });
});
