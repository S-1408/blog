import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // lib/contracts must stay self-contained so it can move to a shared package.
    files: ["lib/contracts/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [{ group: ["@/*", "next", "next/*", "react"], message: "lib/contracts may only import zod and sibling files." }] }],
    },
  },
  {
    // All API access goes through lib/api.
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ignores: ["app/api/**"],
    rules: {
      "no-restricted-globals": ["error", { name: "fetch", message: "Use the data layer in lib/posts.ts (lib/api) instead of calling fetch directly." }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
