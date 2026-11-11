import { describe, expect, it } from "vitest";
import { isPreviewDatabase, requirePreviewDatabase } from "./preview-database.js";

const HOST = "ep-preview-example.eu-central-1.aws.neon.tech";
const configured = { MITEMO_PREVIEW_DB_HOST: HOST, MITEMO_PREVIEW_DB_NAME: "neondb" };
const url = (host: string) =>
  "postgresql://demo:fixture-secret@" + host + "/neondb?sslmode=verify-full";

describe("Preview database identity", () => {
  it("accepts a local dedicated database and rejects other local names", () => {
    expect(isPreviewDatabase({ DATABASE_URL: "postgresql://localhost/mitemo_preview" })).toBe(true);
    expect(isPreviewDatabase({ DATABASE_URL: "postgresql://localhost/neondb" })).toBe(false);
  });

  it("pins the direct Preview endpoint and database independently of DATABASE_URL", () => {
    expect(isPreviewDatabase({ ...configured, DATABASE_URL: url(HOST) })).toBe(true);
    expect(isPreviewDatabase({ DATABASE_URL: url(HOST) })).toBe(false);
    expect(
      isPreviewDatabase({
        ...configured,
        DATABASE_URL: url("ep-production.eu-central-1.aws.neon.tech"),
      }),
    ).toBe(false);
    expect(
      isPreviewDatabase({ ...configured, DATABASE_URL: url(HOST).replace("/neondb", "/other") }),
    ).toBe(false);
  });

  it("rejects ambiguous targets, insecure TLS and pooled endpoints", () => {
    for (const DATABASE_URL of [
      url(HOST) + "&host=production.neon.tech",
      url(HOST) + "&sslmode=disable",
      url(HOST).replace("verify-full", "disable"),
      url(HOST.replace("example", "example-pooler")),
      url(HOST).replace("postgresql:", "https:"),
      "invalid",
    ])
      expect(isPreviewDatabase({ ...configured, DATABASE_URL })).toBe(false);
    expect(
      isPreviewDatabase({ ...configured, MITEMO_PREVIEW_DB_HOST: "*", DATABASE_URL: url(HOST) }),
    ).toBe(false);
  });

  it("fails before connecting and excludes credentials from errors", () => {
    expect(() => requirePreviewDatabase(configured)).toThrow(
      "Cible PostgreSQL Preview non vérifiée.",
    );
    expect(() => requirePreviewDatabase({ DATABASE_URL: url(HOST) })).toThrow(
      /^Cible PostgreSQL Preview non vérifiée\.$/,
    );
    expect(requirePreviewDatabase({ ...configured, DATABASE_URL: url(HOST) })).toBe(url(HOST));
  });
});
