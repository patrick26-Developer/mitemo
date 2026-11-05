import { describe, expect, it } from "vitest";

import { MissingDatabaseUrlError, readDatabaseUrl } from "./database-url.js";

describe("readDatabaseUrl", () => {
  it("renvoie l'URL quand la variable est définie", () => {
    const url = "postgresql://user:pass@localhost:5432/mitemo";
    expect(readDatabaseUrl(url)).toBe(url);
  });

  it("refuse une variable absente en nommant DATABASE_URL", () => {
    expect(() => readDatabaseUrl(undefined)).toThrow(MissingDatabaseUrlError);
    expect(() => readDatabaseUrl(undefined)).toThrow(/DATABASE_URL/);
  });

  it("refuse une chaîne vide", () => {
    expect(() => readDatabaseUrl("")).toThrow(MissingDatabaseUrlError);
  });
});
