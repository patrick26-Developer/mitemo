import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

if (process.env["MITEMO_DEMO_AUTH"] === "true") {
  const target = new URL(process.env["DATABASE_URL"] ?? "");
  const loopback = ["localhost", "127.0.0.1", "[::1]"];
  if (!loopback.includes(target.hostname) || target.pathname !== "/mitemo_test") {
    throw new Error("Les tests HTTP d’écriture exigent PostgreSQL local et mitemo_test.");
  }
}

/** Tests de bout en bout de l'API : application NestJS complète, requêtes HTTP réelles. */
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["test/**/*.e2e-spec.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/features/identity/infrastructure/**",
        "src/features/identity/presentation/**",
        "src/features/wallet/infrastructure/**",
        "src/features/wallet/presentation/**",
      ],
      exclude: ["**/*.spec.ts"],
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage-e2e",
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
