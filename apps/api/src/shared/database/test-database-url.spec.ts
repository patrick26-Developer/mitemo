import { describe, expect, it } from "vitest";

import { requireTestDatabaseUrl, UnsafeTestDatabaseError } from "./test-database-url.js";

const LOCAL = "postgresql://postgres:postgres@localhost:55432/mitemo_test";

describe("requireTestDatabaseUrl", () => {
  it("renvoie l'URL de la base de test dédiée", () => {
    expect(requireTestDatabaseUrl({ TEST_DATABASE_URL: LOCAL })).toBe(LOCAL);
  });

  it("refuse de démarrer sans TEST_DATABASE_URL, même si DATABASE_URL existe", () => {
    expect(() => requireTestDatabaseUrl({ DATABASE_URL: LOCAL })).toThrow(UnsafeTestDatabaseError);
    expect(() => requireTestDatabaseUrl({ TEST_DATABASE_URL: "" })).toThrow(/TEST_DATABASE_URL/);
  });

  it("refuse une base Neon : les tests écrivent des données immuables", () => {
    expect(() =>
      requireTestDatabaseUrl({
        TEST_DATABASE_URL: "postgresql://u:p@ep-abc-123.eu-central-1.aws.neon.tech/neondb",
      }),
    ).toThrow(UnsafeTestDatabaseError);
  });

  it("refuse une URL illisible", () => {
    expect(() => requireTestDatabaseUrl({ TEST_DATABASE_URL: "pas une url" })).toThrow(
      UnsafeTestDatabaseError,
    );
  });

  it("n'inclut jamais l'URL complète, donc aucun mot de passe, dans le message d'erreur", () => {
    expect(() =>
      requireTestDatabaseUrl({ TEST_DATABASE_URL: "postgresql://u:secret@x.neon.tech/db" }),
    ).toThrow(/^(?!.*secret).*$/s);
  });
});
