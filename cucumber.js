'use strict';

module.exports = {
  default: {
    paths: ['test/bdd/features/**/*.feature'],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    require: ['test/bdd/step-definitions/**/*.ts'],
  },
};