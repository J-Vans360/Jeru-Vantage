import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow unescaped entities (apostrophes, quotes) in JSX
      "react/no-unescaped-entities": "off",
      // Allow explicit any type (common in assessment data structures)
      "@typescript-eslint/no-explicit-any": "off",
      // Warn on unused vars instead of error
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    }
  }
]);

export default eslintConfig;
