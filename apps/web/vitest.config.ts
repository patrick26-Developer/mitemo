import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/** Tests unitaires du web : composants rendus dans jsdom avec Testing Library. */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.spec.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/app/layout.tsx"],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
