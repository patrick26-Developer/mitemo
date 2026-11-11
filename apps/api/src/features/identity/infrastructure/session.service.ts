import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import type { ActiveSession, CurrentUser, IsoDateTime, SessionResponse } from "@mitemo/contracts";
import { PrismaService } from "../../../shared/database/prisma.service.js";
import { digestSessionToken, issueSessionToken } from "../domain/session-token.js";
import { demoOnly, userDto } from "./identity-response.js";

const SESSION_MS = 60 * 60 * 1000;

function field(body: unknown, key: string): string {
  const value =
    typeof body === "object" && body !== null ? (Reflect.get(body, key) as unknown) : undefined;
  if (typeof value !== "string") throw new BadRequestException("Champ invalide : " + key);
  return value;
}

function name(body: unknown): string {
  const value = field(body, "displayName").trim();
  if (value.length < 2 || value.length > 80) throw new BadRequestException("Nom invalide");
  return value;
}

/** Authorizes access through persisted and revocable bearer sessions. */
@Injectable()
export class SessionService {
  /**
   * Creates the session service.
   * @param prisma Database connection.
   */
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Reads the profile associated with the presented bearer.
   * @param authorization Bearer header from the current request.
   * @returns The authenticated profile.
   */
  async profile(authorization: string | undefined): Promise<CurrentUser> {
    return userDto((await this.authenticate(authorization)).user);
  }

  /**
   * Updates only the caller's display name.
   * @param authorization Bearer header from the current request.
   * @param body Untrusted JSON body.
   * @returns The updated profile.
   */
  async update(authorization: string | undefined, body: unknown): Promise<CurrentUser> {
    const session = await this.authenticate(authorization);
    return userDto(
      await this.prisma.appUser.update({
        where: { id: session.userId },
        data: { displayName: name(body) },
      }),
    );
  }

  /**
   * Atomically replaces the active bearer, invalidating its predecessor.
   * @param authorization Bearer header from the current request.
   * @returns The session with its rotated token.
   */
  async refresh(authorization: string | undefined): Promise<SessionResponse> {
    const session = await this.authenticate(authorization);
    const accessToken = issueSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MS);
    const updated = await this.prisma.authSession.updateMany({
      where: { id: session.id, tokenHash: session.tokenHash, expiresAt: { gt: new Date() } },
      data: { tokenHash: digestSessionToken(accessToken), expiresAt },
    });
    if (updated.count !== 1) throw new UnauthorizedException();
    return {
      accessToken,
      expiresAt: expiresAt.toISOString() as IsoDateTime,
      user: userDto(session.user),
    };
  }

  /**
   * Revokes the presented bearer.
   * @param authorization Bearer header from the current request.
   */
  async logout(authorization: string | undefined): Promise<void> {
    const session = await this.authenticate(authorization);
    await this.prisma.authSession.deleteMany({
      where: { id: session.id, tokenHash: session.tokenHash },
    });
  }

  /**
   * Lists the caller's active sessions without revealing tokens.
   * @param authorization Bearer header from the current request.
   * @returns The active sessions owned by the caller.
   */
  async sessions(authorization: string | undefined): Promise<readonly ActiveSession[]> {
    const current = await this.authenticate(authorization);
    const rows = await this.prisma.authSession.findMany({
      where: { userId: current.userId, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      deviceLabel: row.deviceLabel,
      current: row.id === current.id,
      createdAt: row.createdAt.toISOString() as IsoDateTime,
      expiresAt: row.expiresAt.toISOString() as IsoDateTime,
    }));
  }

  /**
   * Revokes an active session owned by the caller.
   * @param authorization Bearer header from the current request.
   * @param id UUID of the session to revoke.
   */
  async revoke(authorization: string | undefined, id: string): Promise<void> {
    const current = await this.authenticate(authorization);
    if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) throw new BadRequestException();
    const deleted = await this.prisma.authSession.deleteMany({
      where: { id, userId: current.userId },
    });
    if (deleted.count !== 1) throw new NotFoundException();
  }

  private async authenticate(authorization: string | undefined) {
    demoOnly();
    const token = /^Bearer ([\w-]{43})$/i.exec(authorization ?? "")?.[1];
    if (!token) throw new UnauthorizedException();
    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash: digestSessionToken(token), user: { isDemo: true } },
      include: { user: true },
    });
    if (!session || session.expiresAt <= new Date()) throw new UnauthorizedException();
    return session;
  }
}
