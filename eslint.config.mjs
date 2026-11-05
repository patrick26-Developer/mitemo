/**
 * Configuration ESLint unique du monorepo : elle s'applique à toutes les applications
 * et à tous les paquets. Les règles propres à une application (Next.js, Expo) sont
 * ajoutées ici dans un bloc ciblé par `files`, jamais dans une configuration séparée.
 * Aucune règle commune ne doit être affaiblie pour une application.
 */
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import tseslint from "typescript-eslint";

const NESTED_MAP_IN_JSX =
  "CallExpression[callee.property.name='map'] :matches(JSXElement, JSXFragment) CallExpression[callee.property.name='map']";

const WEB_FILES = ["apps/web/**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];

/**
 * Restreint les blocs de eslint-config-next à l'application web. Le bloc qui ne
 * contient que des `ignores` est retiré : les exclusions sont déclarées plus bas.
 * @param {import("eslint").Linter.Config[]} blocks Blocs fournis par Next.js.
 * @returns {import("eslint").Linter.Config[]} Les mêmes blocs, limités à apps/web.
 */
function scopeToWeb(blocks) {
  return blocks
    .filter((block) => Object.keys(block).some((key) => key !== "ignores"))
    .map((block) => ({ ...block, files: WEB_FILES }));
}

const MOBILE_FILES = ["apps/mobile/**/*.{js,jsx,ts,tsx}"];
const REACT_PLUGINS = ["react", "react-hooks"];

/**
 * Applique au mobile les règles React et Hooks de eslint-config-next, en réutilisant
 * les mêmes instances de plugins (ESLint refuse deux plugins sous le même nom).
 * @param {import("eslint").Linter.Config[]} blocks Blocs fournis par Next.js.
 * @returns {import("eslint").Linter.Config} Bloc limité à apps/mobile.
 */
function reactRulesForMobile(blocks) {
  const [base] = blocks;
  const isReactRule = ([rule]) => REACT_PLUGINS.some((name) => rule.startsWith(`${name}/`));
  return {
    files: MOBILE_FILES,
    plugins: Object.fromEntries(REACT_PLUGINS.map((name) => [name, base.plugins[name]])),
    settings: { react: { version: "19.3" } },
    rules: Object.fromEntries(Object.entries(base.rules).filter(isReactRule)),
  };
}

const TEST_FILES = ["**/*.spec.*", "**/*.test.*", "**/*.int-spec.*", "**/*.e2e-spec.*"];

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
      "**/src/generated/**",
      "**/next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...scopeToWeb(nextVitals),
  {
    files: WEB_FILES,
    settings: { next: { rootDir: "apps/web/" } },
  },
  reactRulesForMobile(nextVitals),
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["error", { max: 20, skipBlankLines: true, skipComments: true }],
      "max-statements": ["error", 10],
      "max-params": ["error", 3],
      "max-depth": ["error", 3],
      "max-nested-callbacks": ["error", 2],
      complexity: ["error", 8],
      "no-nested-ternary": "error",
      "no-console": ["error", { allow: ["error"] }],
      "no-restricted-syntax": [
        "error",
        {
          selector: NESTED_MAP_IN_JSX,
          message:
            "Pas de .map() imbriqué dans le JSX : extraire l'élément de liste dans un composant dédié.",
        },
        {
          selector: "TSEnumDeclaration",
          message: "Pas d'enum : utiliser un tableau `as const` et le type union dérivé.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@mitemo/*/src/*", "@mitemo/*/dist/*"],
              message:
                "Importer depuis la racine du paquet (@mitemo/contracts), jamais un fichier interne.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-extraneous-class": ["error", { allowWithDecorator: true }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description", "ts-ignore": true },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: false },
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          custom: { regex: "Type$", match: false },
        },
      ],
    },
  },
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "max-lines-per-function": ["error", { max: 40, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...jsdoc.configs["flat/recommended-error"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...jsdoc.configs["flat/recommended-typescript-error"],
  },
  {
    rules: {
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      "jsdoc/require-description": "error",
      "jsdoc/no-bad-blocks": "error",
    },
  },
  {
    files: TEST_FILES,
    rules: {
      "max-lines-per-function": "off",
      "max-statements": "off",
      "max-nested-callbacks": ["error", 4],
      "jsdoc/require-jsdoc": "off",
    },
  },
  prettier,
);
