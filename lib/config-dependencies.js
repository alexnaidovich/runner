const inquirer = require('inquirer');
const CONFIG = require('../config/deps.config.json');
const { rewriteSettings } = require('./helpers');
const package_json = {};

// inquirer questions 
const {
  author_pick,
  author_input,
  name_and_description,
  is_dev_deps_cached,
  choose_dev_deps_kit,
  input_dev_deps
} = require('./inquirer-questions').config_dependencies;

async function defineAuthor() {
  const PICK = () => inquirer.prompt(author_pick);
  const INPUT = () => inquirer.prompt(author_input);

  //   1.1. Select from list of default authors or 'input manually'
  const { _author } = await PICK();

  //   1.2. If 'input manually' - offer to store in defaults.
    if (_author === "input manually") { 

      const { author, storeName } = await INPUT();
  
      if (storeName) {
        CONFIG.defaultAuthors.push(author);
        rewriteSettings(CONFIG, 'deps');
      }
      package_json['author'] = author;
      return author;
    }
    package_json['author'] = _author;
    return _author;
}

async function setNameAndDescription() {
  const INPUT = () => inquirer.prompt(name_and_description);
  const { name, description } = await INPUT();
  Object.assign(package_json, { name, description });
  return [ name, description ];
}

async function defineIfDevDepsCached() {
  const INPUT = () => inquirer.prompt(is_dev_deps_cached);
  const { isDevDepsCached } = await INPUT();
  return isDevDepsCached;
}

async function chooseDevDepsKit() {
  const CHOOSE = () => inquirer.prompt(choose_dev_deps_kit);
  const { chooseDevDepsKit } = await CHOOSE();
  if (chooseDevDepsKit === "input manually") {
    const INPUT = () => inquirer.prompt(input_dev_deps);
    const { inputDevDeps, saveDevDeps } = await INPUT();
  } else {
    return chooseDevDepsKit;
  }
}

module.exports = async function main() {
  // Plan: 
  // 1. Define author by default
  let author = await defineAuthor();
  
  // 2. Give name and description to the project
  let [ name, description ] = await setNameAndDescription();

  //   2.1. Copy fields "version" and "scripts"
  let { version, scripts } = CONFIG.examplePackageJson;
  Object.assign(package_json, { version, scripts });

  
  // 3. Define devDeps
  //   3.1. Define if they are cahced or not 
  let isDevDepsCached = await defineIfDevDepsCached();

  //     3.1.1. If devDeps are cahced, choose directory to install from (with 'input manually' value and offer to store)
  //     3.1.2. If not, go to 3.2
  if (isDevDepsCached) {

  } else {
    //   3.2. Select devDeps kit to install (with 'input manually' value)
    //     3.2.1. If inputted manually, offer to save input as a devDeps kit
    let devDepsKit = await chooseDevDepsKit();
  }


  // test
  return [ author, name, description, JSON.stringify(package_json, null, 2) ];
  // 4. Define deps
  //   4.1. Select deps kit to install (with 'input manually' value)
  //     4.1.1. If inputted manually, offer to save input as a deps kit
  // 5. Save 'package.json'
  // 6. Perform 'npm install'
}


