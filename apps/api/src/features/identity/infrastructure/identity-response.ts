import { NotFoundException } from "@nestjs/common";
import type { CurrentUser, UserId } from "@mitemo/contracts";
import type { AppUser } from "../../../generated/prisma/client.js";

/**
 * Maps a persisted user to the public identity.
 * @param user Persisted identity.
 * @returns Public profile.
 */
export function userDto(user: AppUser): CurrentUser {
  return {
    userId: user.id as UserId,
    displayName: user.displayName,
    maskedPhoneNumber: user.phoneNumber.slice(0, 4) + "*****" + user.phoneNumber.slice(-2),
    role: user.role === "ADMIN" ? "ADMIN" : "USER",
  };
}

function isDedicatedRenderPreview(): boolean {
  const database = URL.canParse(process.env["DATABASE_URL"] ?? "")
    ? new URL(process.env["DATABASE_URL"] ?? "")
    : undefined;
  return (
    process.env["RENDER"] === "true" &&
    process.env["RENDER_SERVICE_NAME"] === "mitemo-api-dev" &&
    database?.pathname === "/mitemo_preview" &&
    !database.hostname.endsWith(".neon.tech")
  );
}

/**
 * Reports whether the separately configured remote preview is enabled.
 * @returns True only with explicit preview settings and a configured tester credential.
 */
export function previewEnabled(): boolean {
  return (
    (isDedicatedRenderPreview() ||
      (process.env["NODE_ENV"] === "test" && process.env["RENDER"] !== "true")) &&
    process.env["MITEMO_DEPLOYMENT"] === "preview" &&
    process.env["MITEMO_DEMO_AUTH"] === "true" &&
    (process.env["MITEMO_PREVIEW_KEY"]?.length ?? 0) >= 32
  );
}

/** Keeps simulated authentication disabled unless the deployment explicitly opts in. */
export function demoOnly(): void {
  if (previewEnabled()) return;
  const local =
    process.env["NODE_ENV"] !== "production" &&
    process.env["RENDER"] !== "true" &&
    process.env["MITEMO_DEPLOYMENT"] === undefined;
  if (!local || process.env["MITEMO_DEMO_AUTH"] !== "true") throw new NotFoundException();
}
