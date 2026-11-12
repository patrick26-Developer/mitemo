import { describe, expect, it } from "vitest";

import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  it("répond que l'API est en vie", () => {
    expect(new HealthController().check()).toEqual({ status: "ok" });
  });
});
