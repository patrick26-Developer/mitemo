import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

/**
 * Tests unitaires de l'API. SWC remplace esbuild pour émettre les métadonnées
 * de décorateurs dont l'injection de dépendances de NestJS a besoin.
 */
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/main.ts", "src/**/*.module.ts", "src/generated/**"],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
        "src/features/*/domain/**": { lines: 90, branches: 90, functions: 90, statements: 90 },
        "src/features/*/application/**": {
          lines: 90,
          branches: 90,
          functions: 90,
          statements: 90,
        },
      },
    },
  },
});
