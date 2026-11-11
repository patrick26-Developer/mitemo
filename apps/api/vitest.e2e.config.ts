import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

/** Tests de bout en bout de l'API : application NestJS complète, requêtes HTTP réelles. */
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["test/**/*.e2e-spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/features/identity/infrastructure/**", "src/features/identity/presentation/**"],
      exclude: ["**/*.spec.ts"],
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage-e2e",
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
