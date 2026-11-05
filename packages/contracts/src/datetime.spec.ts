import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toIsoDateTime } from "./datetime.ts";
import type { IsoDateTime } from "./datetime.ts";

describe("toIsoDateTime", () => {
  it("marque une chaîne comme date ISO 8601 UTC", () => {
    const raw = "2026-11-06T12:00:00.000Z";

    assert.equal(toIsoDateTime(raw), raw);
  });

  it("n'accepte pas une chaîne brute sans passer par toIsoDateTime", () => {
    // @ts-expect-error une chaîne brute n'a pas la marque IsoDateTime
    const raw: IsoDateTime = "2026-11-06T12:00:00.000Z";

    assert.equal(typeof raw, "string");
  });
});
