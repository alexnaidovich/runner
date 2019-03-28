#!/usr/bin/env node
// https://codeburst.io/building-a-node-js-interactive-cli-3cb80ed76c86

const inquirer = require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

// additions
const { exec } = require('child_process');
const dirname = __dirname;
const dir_lib = path.resolve(dirname, 'lib');
const dir_config = path.resolve(dirname, 'config');

// components
const [
  helpers, intro, configDependencies
] = [
  'helpers', 'intro', 'config-dependencies'
].map(component => require(path.join(dir_lib, component)));

const { 
  rewriteSettings,
  npmInit,
  npmInstall
} = helpers;

(async function main() {

  // show intro
  intro();

  // configure dependencies
  const test = await configDependencies(dirname, dir_config);
  console.log(
    chalk.cyan(test)
  );

  // configure webpack
  // configure ejs components
  // configure styles
  // write files
  // show success

})();
