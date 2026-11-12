import { createHash, timingSafeEqual } from "node:crypto";
import {
  Injectable,
  Inject,
  Optional,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { demoOnly, previewEnabled } from "../infrastructure/identity-response.js";
import { SESSION_AUTHENTICATOR } from "../domain/session-authenticator.js";
import type { SessionAuthenticator } from "../domain/session-authenticator.js";
import { verifyPreviewAdmission } from "../../../shared/security/preview-admission.js";

const ADMISSION_ROUTES = new Set(["/auth/register", "/auth/login", "/auth/verify"]);

interface PreviewRequest {
  readonly originalUrl: string;
  readonly headers: Record<string, unknown>;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Protects remote enrollment and simulated OTP delivery with a tester credential. */
@Injectable()
export class DemoAccessGuard implements CanActivate {
  /**
   * Vérifie les sessions persistées plutôt que la présence d'un en-tête.
   * @param sessions Authentification Bearer des routes privées.
   */
  constructor(
    @Optional() @Inject(SESSION_AUTHENTICATOR) private readonly sessions?: SessionAuthenticator,
  ) {}

  /**
   * Reads the tester credential before the request reaches the authentication flow.
   * @param context Nest HTTP context.
   * @returns Whether the request can proceed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    demoOnly();
    if (!previewEnabled()) return true;
    const request = context.switchToHttp().getRequest<PreviewRequest>();
    if (await this.mobileAccess(request)) return true;
    this.assertAccess(request.headers["x-mitemo-preview-key"]);
    return true;
  }

  private async mobileAccess(request: PreviewRequest): Promise<boolean> {
    const path = request.originalUrl.split("?")[0] ?? "";
    if (ADMISSION_ROUTES.has(path)) {
      return verifyPreviewAdmission(request.headers["x-mitemo-preview-admission"], {
        secret: process.env["MITEMO_PREVIEW_KEY"] ?? "",
        now: Math.floor(Date.now() / 1000),
      });
    }
    const authorization = request.headers["authorization"];
    if (typeof authorization !== "string" || !this.sessions) return false;
    await this.sessions.profile(authorization);
    return true;
  }

  /**
   * Enforces the deployment mode and verifies the preview key in constant time.
   * @param supplied Credential from the request header.
   */
  assertAccess(supplied: unknown): void {
    demoOnly();
    if (!previewEnabled()) return;
    const expected = process.env["MITEMO_PREVIEW_KEY"] ?? "";
    if (typeof supplied !== "string" || !timingSafeEqual(digest(supplied), digest(expected))) {
      throw new UnauthorizedException();
    }
  }
}
