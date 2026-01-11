/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@printy-mobile/eslint-config/react-internal.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-redeclare': 'off',
  },
};
