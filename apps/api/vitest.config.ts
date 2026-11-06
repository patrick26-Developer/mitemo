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
      exclude: [
        "src/main.ts",
        "src/**/*.module.ts",
        "src/generated/**",
        // Jamais exécutés par cette config (test.include ne cible que *.spec.ts) :
        // un fichier *.int-spec.ts compté comme cible de couverture affiche
        // toujours 0 %, quel que soit son contenu.
        "src/**/*.int-spec.ts",
        // Câblage d'infrastructure fin (constructeur + hooks de cycle de vie Nest),
        // même catégorie que main.ts/*.module.ts ci-dessus : sa correction est
        // vérifiée par prisma.service.int-spec.ts contre une vraie base, pas par
        // un test unitaire qui mockerait l'adaptateur Prisma sans rien prouver.
        "src/shared/database/prisma.service.ts",
        // Adaptateurs Prisma : leur comportement (contraintes, déclencheurs, concurrence)
        // n'a de sens que contre une vraie base. Ils sont couverts par leur fichier
        // *.int-spec.ts, exécuté en CI contre PostgreSQL, et non par un mock.
        "src/features/*/infrastructure/prisma-*.repository.ts",
      ],
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
