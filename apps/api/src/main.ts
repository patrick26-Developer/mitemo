import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { readPort } from "./shared/config/port.js";

const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();
if (
  process.env["NODE_ENV"] !== "production" &&
  process.env["RENDER"] !== "true" &&
  process.env["MITEMO_DEPLOYMENT"] === undefined &&
  process.env["MITEMO_DEMO_AUTH"] === "true"
) {
  const config = new DocumentBuilder().setTitle("Mitemo — Démonstration").addBearerAuth().build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));
}
await app.listen(readPort(process.env["PORT"]), "0.0.0.0");
