import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import neostandard from "neostandard";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "module",
      ecmaVersion: "latest",
      parser: neostandard.parser,
      parserOptions: neostandard.parserOptions,
    },
    plugins: neostandard.plugins,
    rules: {
      ...neostandard.rules,
      "arrow-parens": ["error", "as-needed"],
      "no-console": "off",
      "no-debugger": "off",
      "no-unused-vars": "off",
      "no-empty": "off",
      "no-empty-function": "off",
    },
  },
]);
