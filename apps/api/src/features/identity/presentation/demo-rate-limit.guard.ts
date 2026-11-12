import {
  HttpException,
  HttpStatus,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";

/** Bounds credential hashing attempts per client and across the development process. */
@Injectable()
export class DemoRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, number>();
  private windowEndsAt = 0;
  private total = 0;

  /**
   * Checks the request budget before any credential hashing.
   * @param context HTTP execution context.
   * @returns Whether the request can proceed.
   */
  canActivate(context: ExecutionContext): boolean {
    if (Date.now() >= this.windowEndsAt) this.reset();
    const request = context.switchToHttp().getRequest<{ ip?: string }>();
    const key = request.ip ?? "unknown";
    const count = this.attempts.get(key) ?? 0;
    if (count >= 20 || this.total >= 120) {
      throw new HttpException("Trop de tentatives", HttpStatus.TOO_MANY_REQUESTS);
    }
    this.attempts.set(key, count + 1);
    this.total += 1;
    return true;
  }

  private reset(): void {
    this.windowEndsAt = Date.now() + 60_000;
    this.total = 0;
    this.attempts.clear();
  }
}
