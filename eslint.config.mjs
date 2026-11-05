// Configuration ESLint racine. Chaque application l'étend avec ses règles propres
// (NestJS, Next.js, Expo) dans son propre eslint.config.mjs.
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.expo/**",
      "**/coverage/**",
      "**/.turbo/**",
      "apps/**",
      "packages/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "max-lines-per-function": ["error", { max: 20, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 3],
      "max-depth": ["error", 3],
      complexity: ["error", 8],
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description", "ts-ignore": true },
      ],
    },
  },
  {
    files: ["**/*.spec.*", "**/*.test.*", "**/*.int-spec.*", "**/*.e2e-spec.*"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
  prettier,
);
