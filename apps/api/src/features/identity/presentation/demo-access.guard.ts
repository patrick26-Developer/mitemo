import { createHash, timingSafeEqual } from "node:crypto";
import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { demoOnly, previewEnabled } from "../infrastructure/identity-response.js";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Protects remote enrollment and simulated OTP delivery with a tester credential. */
@Injectable()
export class DemoAccessGuard implements CanActivate {
  /**
   * Reads the tester credential before the request reaches the authentication flow.
   * @param context Nest HTTP context.
   * @returns Whether the request can proceed.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, unknown> }>();
    this.assertAccess(request.headers["x-mitemo-preview-key"]);
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
