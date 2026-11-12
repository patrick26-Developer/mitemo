import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { DemoAccessGuard, previewEnabled } from "../../features/identity/index.js";

interface DocsRequest {
  readonly headers: Record<string, unknown>;
}

interface DocsResponse {
  setHeader(name: string, value: string): void;
  status(code: number): DocsResponse;
  end(): void;
}

function basicKey(request: DocsRequest): string | undefined {
  const authorization = request.headers["authorization"];
  const basic = typeof authorization === "string" ? /^Basic (\S+)$/i.exec(authorization) : null;
  const decoded = Buffer.from(basic?.[1] ?? "", "base64").toString("utf8");
  return decoded.startsWith("preview:") ? decoded.slice("preview:".length) : undefined;
}

function protectPreviewDocs(request: DocsRequest, response: DocsResponse, next: () => void): void {
  response.setHeader("Cache-Control", "no-store");
  const key = basicKey(request);
  try {
    new DemoAccessGuard().assertAccess(request.headers["x-mitemo-preview-key"] ?? key);
  } catch {
    response.setHeader("WWW-Authenticate", 'Basic realm="Mitemo Preview"');
    response.status(401).end();
    return;
  }
  next();
}

/**
 * Mounts Swagger in local demonstration and protects all of its Preview resources.
 * @param app Nest application before HTTP initialization.
 */
export function setupOpenApi(app: INestApplication): void {
  const preview = previewEnabled();
  const local =
    process.env["NODE_ENV"] !== "production" &&
    process.env["RENDER"] !== "true" &&
    process.env["MITEMO_DEPLOYMENT"] === undefined &&
    process.env["MITEMO_DEMO_AUTH"] === "true";
  if (!preview && !local) return;
  if (preview) app.use(["/docs", "/docs-json"], protectPreviewDocs);

  const config = new DocumentBuilder()
    .setTitle("Mitemo — API de démonstration")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, () => SwaggerModule.createDocument(app, config), {
    raw: ["json"],
    ...(preview ? { swaggerOptions: { supportedSubmitMethods: [] } } : {}),
  });
}
