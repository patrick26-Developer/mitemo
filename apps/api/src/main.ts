import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { setupOpenApi } from "./shared/config/openapi.js";
import { AppModule } from "./app.module.js";
import { readPort } from "./shared/config/port.js";

const app = await NestFactory.create(AppModule, { rawBody: true });
app.enableShutdownHooks();
setupOpenApi(app);
await app.listen(readPort(process.env["PORT"]), "0.0.0.0");
