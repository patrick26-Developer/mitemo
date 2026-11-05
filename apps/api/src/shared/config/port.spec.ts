import { describe, expect, it } from "vitest";

import { InvalidPortError, readPort } from "./port.js";

describe("readPort", () => {
  it("utilise 3000 quand la variable est absente", () => {
    expect(readPort(undefined)).toBe(3000);
  });

  it("lit un port valide", () => {
    expect(readPort("8080")).toBe(8080);
  });

  it.each(["", "0", "65536", "80.5", "abc", "-1", " 80"])("refuse %j", (raw) => {
    expect(() => readPort(raw)).toThrow(InvalidPortError);
  });
});
