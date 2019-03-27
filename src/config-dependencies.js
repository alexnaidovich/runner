const inquirer = require('inquirer');
const { 
  author,
  examplePackageJson,
  isDevDepsCached,
  devDepsCachePaths,
  devDepsKits,
  depsKits
} = require('../settings.json');

// Plan: 
// 1. Define author by default
//   1.1. Select from list of default authors or 'input manually'
//   1.2. If 'input manually' - offer to store in defaults.
// 2. Give name and description to the project
// 3. Define devDeps
//   3.1. Define if they are cahced or not 
//     3.1.1. If devDeps are cahced, choose directory to install from (with 'input manually' value and offer to store)
//     3.1.2. If not, go to 3.2
//   3.2. Select devDeps kit to install (with 'input manually' value)
//     3.2.1. If inputted manually, offer to save input as a devDeps kit
// 4. Define deps
//   4.1. Select deps kit to install (with 'input manually' value)
//     4.1.1. If inputted manually, offer to save input as a deps kit
// 5. Save 'package.json'
// 6. Perform 'npm install'


const MAIN_QUESTIONS = [
  {
    name: 'isDevDepsCached',
    message: 'Are your devDependencies cached somewhere?',
    type: 'confirm',
    default: isDevDepsCached || false
  }
]

const IF_CACHED_QUESTIONS = [
  {
    name: "devDepsCachePaths",
    message: "Choose a path where your devDependencies are installed",
    type: "list",
    choices: devDepsCachePaths.map(entry => entry.path),
    default: devDepsCachePaths.findIndex(entry => entry.default)
  }
]



module.exports.main = () => {
  return inquirer.prompt(MAIN_QUESTIONS);
}

module.exports.ifCached = () => {
  // TODO
}

module.exports.ifNotCached = () => {
  // TODO
}