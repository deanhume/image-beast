module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
  },
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "globals": {
    "supertest": true
  },
  "rules": {
    "global-require": 0,
    "no-cond-assign": [2, "except-parens"],
    "radix": 0,
    "no-unused-vars": [1, { "vars": "local", "args": "none" }],
    "no-else-return": 0,
    "no-console": 1,
    // Allow setting variables within ternary expressions
    "no-unused-expressions": [2, { "allowTernary": true }],
    "comma-dangle": 0,
    "eol-last": 0,
    "no-use-before-define": ["error", { "functions": false }],
    "space-before-function-paren": 0
  }
};
