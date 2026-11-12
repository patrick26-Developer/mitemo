import { randomInt, randomUUID } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { hash, verify } from "argon2";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import type {
  CurrentUser,
  LoginChallengeId,
  SessionResponse,
  StartLoginResponse,
  IsoDateTime,
} from "@mitemo/contracts";
import { type AppUser, type AuthChallenge, Prisma } from "../../../generated/prisma/client.js";
import { PrismaService } from "../../../shared/database/prisma.service.js";
import { demoOnly, userDto } from "./identity-response.js";
import { digestSessionToken, issueSessionToken } from "../domain/session-token.js";

const SESSION_MS = 60 * 60 * 1000;
const CHALLENGE_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function field(body: unknown, key: string): string {
  const value =
    typeof body === "object" && body !== null ? (Reflect.get(body, key) as unknown) : undefined;
  if (typeof value !== "string") throw new BadRequestException("Champ invalide : " + key);
  return value;
}

function phone(body: unknown): string {
  const input = field(body, "phoneNumber");
  const parsed = parsePhoneNumberFromString(input, { extract: false });
  if (!parsed?.isValid() || parsed.country !== "CG" || parsed.number !== input) {
    throw new BadRequestException("Numéro congolais au format international requis");
  }
  return input;
}

function sixDigits(body: unknown, key: string): string {
  const value = field(body, key);
  if (!/^[0-9]{6}$/.test(value)) throw new BadRequestException("Six chiffres requis");
  return value;
}

function name(body: unknown): string {
  const value = field(body, "displayName").trim();
  if (value.length < 2 || value.length > 80) throw new BadRequestException("Nom invalide");
  return value;
}

function optionalDevice(body: unknown): string | null {
  const value =
    typeof body === "object" && body !== null
      ? (Reflect.get(body, "deviceLabel") as unknown)
      : undefined;
  if (value === undefined) return null;
  if (typeof value !== "string" || value.trim().length < 1 || value.length > 80) {
    throw new BadRequestException("Nom d’appareil invalide");
  }
  return value.trim();
}

/** Persists demo identities, single-use challenges and revocable sessions. */
@Injectable()
export class IdentityService {
  /**
   * Initializes identity persistence.
   * @param prisma Database connection.
   */
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Registers a user with a server-side PIN hash.
   * @param body Untrusted JSON body.
   * @returns The created profile.
   */
  async register(body: unknown): Promise<CurrentUser> {
    demoOnly();
    const data = {
      id: randomUUID(),
      phoneNumber: phone(body),
      displayName: name(body),
      pinHash: await hash(sixDigits(body, "pin")),
    };
    return this.createUser(data);
  }

  private async createUser(data: {
    id: string;
    phoneNumber: string;
    displayName: string;
    pinHash: string;
  }) {
    const walletAccount = { create: { id: "wallet:" + data.id, kind: "WALLET_USER" } };
    try {
      return userDto(
        await this.prisma.appUser.create({ data: { ...data, isDemo: true, walletAccount } }),
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Ce numéro est déjà inscrit");
      }
      throw error;
    }
  }

  /**
   * Verifies the PIN and opens a short-lived simulated challenge.
   * @param body Untrusted JSON body.
   * @returns The temporary simulated challenge.
   */
  async login(body: unknown): Promise<StartLoginResponse> {
    demoOnly();
    const user = await this.prisma.appUser.findUnique({
      where: { phoneNumber: phone(body), isDemo: true },
    });
    const pin = sixDigits(body, "pin");
    if (!user || !(await verify(user.pinHash, pin))) throw new UnauthorizedException();
    return this.issueChallenge(user.id);
  }

  private async issueChallenge(userId: string): Promise<StartLoginResponse> {
    const simulatedOtp = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const challenge = await this.prisma.authChallenge.create({
      data: {
        id: randomUUID(),
        userId,
        expiresAt: new Date(Date.now() + CHALLENGE_MS),
        otpHash: await hash(simulatedOtp),
      },
    });
    return {
      challengeId: challenge.id as LoginChallengeId,
      expiresAt: challenge.expiresAt.toISOString() as IsoDateTime,
      simulatedOtp,
    };
  }

  /**
   * Consumes the challenge at most once and persists a new session.
   * @param body Untrusted JSON body.
   * @returns The newly created server session.
   */
  async verify(body: unknown): Promise<SessionResponse> {
    demoOnly();
    const id = field(body, "challengeId");
    const otp = sixDigits(body, "otp");
    const deviceLabel = optionalDevice(body);
    if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))
      throw new BadRequestException("Défi invalide");
    const challenge = await this.checkChallenge(id, otp);
    return this.openSession(challenge, deviceLabel);
  }

  private async checkChallenge(id: string, otp: string) {
    const where = {
      id,
      consumedAt: null,
      user: { isDemo: true },
      expiresAt: { gt: new Date() },
      attempts: { lt: MAX_ATTEMPTS },
    };
    const attempt = await this.prisma.authChallenge.updateMany({
      where,
      data: { attempts: { increment: 1 } },
    });
    if (attempt.count !== 1) throw new UnauthorizedException();
    const challenge = await this.prisma.authChallenge.findUniqueOrThrow({
      where: { id },
      include: { user: true },
    });
    if (!(await verify(challenge.otpHash, otp))) throw new UnauthorizedException();
    return challenge;
  }

  private async openSession(
    challenge: AuthChallenge & { user: AppUser },
    deviceLabel: string | null,
  ): Promise<SessionResponse> {
    const accessToken = issueSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MS);
    await this.persistSession(challenge.id, {
      id: randomUUID(),
      userId: challenge.userId,
      deviceLabel,
      expiresAt,
      tokenHash: digestSessionToken(accessToken),
    });
    return {
      accessToken,
      expiresAt: expiresAt.toISOString() as IsoDateTime,
      user: userDto(challenge.user),
    };
  }

  private async persistSession(
    id: string,
    data: Prisma.AuthSessionUncheckedCreateInput,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const consumed = await tx.authChallenge.updateMany({
        where: { id, consumedAt: null, user: { isDemo: true }, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      });
      if (consumed.count !== 1) throw new UnauthorizedException();
      await tx.authSession.create({ data });
    });
  }
}
