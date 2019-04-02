#!/usr/bin/env node
// https://codeburst.io/building-a-node-js-interactive-cli-3cb80ed76c86

const chalk = require('chalk');
const path = require('path');

// additions
const dir_lib = path.resolve(__dirname, 'lib');
const dir_config = path.resolve(__dirname, 'config');

// components
const [
  intro, configDependencies, configWebpack
] = [
  'intro', 'config-dependencies', 'config-webpack'
].map(component => require(path.join(dir_lib, component)));

(async function main() {

  // show intro
  intro();

  // configure dependencies
  const test = await configDependencies(__dirname, dir_config);
  console.log(
    chalk.cyan(test)
  );

  // configure webpack
  const test2 = await configWebpack();
  console.log(
    chalk.yellow(test2)
  );

  // configure ejs components
  // configure styles
  // write files
  // show success

})();
