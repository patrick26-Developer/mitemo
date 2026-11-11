import { createPublicKey } from "node:crypto";
import {
  BadRequestException,
  Controller,
  HttpCode,
  Inject,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  type RawBodyRequest,
} from "@nestjs/common";
interface Request {
  readonly originalUrl: string;
  readonly headers: Readonly<Record<string, string | string[] | undefined>>;
  readonly body: unknown;
}
import { PrismaService } from "../../../shared/database/prisma.service.js";
import { sandboxReceipt } from "../domain/sandbox-receipt.js";
import { verifyCallbackSignature } from "../infrastructure/callback-signature.js";

const PATH = "/integrations/pawapay/sandbox/callback";
const AUTHORITY = "mitemo-api-dev.onrender.com";

function verifyRequest(request: RawBodyRequest<Request>): boolean {
  const keyId = process.env["PAWAPAY_SANDBOX_CALLBACK_KEY_ID"];
  const pem = process.env["PAWAPAY_SANDBOX_CALLBACK_PUBLIC_KEY"];
  if (!keyId || !pem || !request.rawBody || request.originalUrl !== PATH) return false;
  try {
    return verifyCallbackSignature({
      keyId,
      publicKey: createPublicKey(pem),
      raw: request.rawBody,
      headers: request.headers,
      now: Math.floor(Date.now() / 1000),
      authority: AUTHORITY,
      path: PATH,
    });
  } catch {
    return false;
  }
}

/** Stores authenticated Sandbox observations independently of the ledger. */
@Controller("integrations/pawapay/sandbox")
export class SandboxCallbackController {
  /**
   * Wires the database used to deduplicate observations.
   * @param prisma Database service.
   */
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Acknowledges a verified observation once it is durably recorded.
   * @param request HTTP message including its original bytes.
   */
  @Post("callback")
  @HttpCode(200)
  async receive(@Req() request: RawBodyRequest<Request>): Promise<void> {
    if (
      process.env["PAWAPAY_SANDBOX_ENABLED"] !== "true" ||
      process.env["MITEMO_DEPLOYMENT"] !== "preview" ||
      process.env["RENDER_SERVICE_NAME"] !== "mitemo-api-dev"
    )
      throw new NotFoundException();
    if (!verifyRequest(request)) throw new UnauthorizedException();
    const receipt = sandboxReceipt(request.body);
    if (!receipt) throw new BadRequestException("Notification Sandbox invalide.");
    await this.prisma.pawaPaySandboxReceipt.createMany({ data: receipt, skipDuplicates: true });
  }
}
