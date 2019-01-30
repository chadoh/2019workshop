module.exports = {
  env: {
    "node": true,
    es6: true
  },
  extends: [
    "prettier",
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    "comma-dangle": ["error", "always-multiline"],
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};
