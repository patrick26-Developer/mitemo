import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

/** Tests de bout en bout de l'API : application NestJS complète, requêtes HTTP réelles. */
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["test/**/*.e2e-spec.ts"],
  },
});
