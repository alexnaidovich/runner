const inquirer = require('inquirer');
const { 
  isDevDepsCached,
  devDepsCachePaths
} = require('../settings.json');

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