#!/usr/bin/env node
// https://codeburst.io/building-a-node-js-interactive-cli-3cb80ed76c86

const inquirer = require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path'); // <- throws errors

// additions
const { exec } = require('child_process');
const dirname = __dirname;
const dir_lib = path.resolve(dirname, 'lib');
const dir_config = path.resolve(dirname, 'config');

// parts
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

// settings
const SETTINGS = require('./settings.json');

(async function main() {

  // show intro
  intro();

  // configure dependencies
  const { isDevDepsCached } = await configDependencies.main();

  if (isDevDepsCached !== SETTINGS.isDevDepsCached) {
    rewriteSettings(SETTINGS, 'isDevDepsCached', isDevDepsCached);
    SETTINGS['isDevDepsCached'] = isDevDepsCached;
  }

  if (isDevDepsCached) {
    // npmInit();
    
  }

  // configure webpack
  // configure ejs components
  // configure styles
  // write files
  // show success

})();
