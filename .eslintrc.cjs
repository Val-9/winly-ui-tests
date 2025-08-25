/* eslint-env node */
module.exports = {
  root: true,
  env: { es2022: true, node: true },
  extends: ["eslint:recommended", "plugin:playwright/recommended", "prettier"],
  plugins: ["playwright"],
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "playwright/expect-expect": "off"
  },
  ignorePatterns: ["**/playwright-report/**", "**/test-results/**", "node_modules/**"]
};
