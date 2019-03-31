const inquirer = require('inquirer');
const CONFIG = require('../config/deps.config.json');
const { 
  rewriteSettings,
  scanCachedDevDependencies,
  savePackageJson,
  npmInstall
} = require('./helpers');
const package_json = {};

// inquirer questions 
const {
  author_pick,
  author_input,
  name_and_description,
  is_dev_deps_cached,
  choose_dev_deps_kit,
  input_dev_deps,
  choose_dev_deps_cached_path,
  input_dev_deps_cache_path,
  choose_deps_kit,
  input_deps
} = require('./inquirer-questions').config_dependencies;

/**
 * Handler to answer the 'input manually' case questions.
 * 
 * @param {String} choice Previous question's answer
 * @param {Array} questions List of the next questions
 * @param {String} configArray Name of the config's property (this property should be an Array)
 * @param {String} inputKey Name of the first incoming answer's property
 * @param {String} confirmKey Name of the second incoming answer's property
 * @returns {String} Final answer
 */
async function ifInputManually(choice, questions, configArray, inputKey, confirmKey) {
  if (choice === "input manually") {
    const INPUT = () => inquirer.prompt(questions);
    const answers = await INPUT();
    if (answers[confirmKey]) {
      CONFIG[configArray].push(answers[inputKey]);
      rewriteSettings(CONFIG, 'deps');
    }
    return answers[inputKey];
  }
  return choice;
}

async function defineAuthor() {
  const PICK = () => inquirer.prompt(author_pick);
  //   1.1. Select from list of default authors or 'input manually'
  //   1.2. If 'input manually' - offer to store in defaults.
  const { _author } = await PICK();
  return ifInputManually(
    _author,
    author_input,
    'defaultAuthors',
    'author',
    'storeName'
  );
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
  return await ifInputManually(
    chooseDevDepsKit,
    input_dev_deps,
    'devDepsKits',
    'inputDevDeps',
    'saveDevDeps'
  );
}

async function _chooseDevDepsCachedPath() {
  const CHOOSE = () => inquirer.prompt(choose_dev_deps_cached_path);
  const { chooseDevDepsCachePath } = await CHOOSE();
  return await ifInputManually(
    chooseDevDepsCachePath, 
    input_dev_deps_cache_path,
    'devDepsCachePaths',
    'inputDevDepsCachePath',
    'saveDevDepsCachePath'
  );
}

async function chooseDepsKit() {
  const CHOOSE = () => inquirer.prompt(choose_deps_kit);
  const { chooseDepsKit } = await CHOOSE();
  return await ifInputManually(
    chooseDepsKit,
    input_deps,
    'depsKits',
    "inputDeps",
    "saveDepsKit"
  );
}

module.exports = async function main() {
  try {
    // Plan: 
    // 1. Define author by default
    const author = await defineAuthor();
    Object.assign(package_json, { author });
    
    // 2. Give name and description to the project
    await setNameAndDescription();

    //   2.1. Copy fields "version" and "scripts"
    let { version, scripts } = CONFIG.examplePackageJson;
    Object.assign(package_json, { version, scripts });
    
    // 3. Define devDeps
    //   3.1. Define if they are cahced or not 
    let isDevDepsCached = await defineIfDevDepsCached();
    //     3.1.1. If devDeps are cahced, choose directory to install from (with 'input manually' value and offer to store)
    //     3.1.2. If not, go to 3.2
    if (isDevDepsCached) {
      let cachePath = await _chooseDevDepsCachedPath();
      let devDeps = await scanCachedDevDependencies(cachePath);
      Object.assign(package_json, {devDependencies: devDeps});
      await savePackageJson(package_json);
      await npmInstall(true);
    } else {
      //   3.2. Select devDeps kit to install (with 'input manually' value)
      //     3.2.1. If inputted manually, offer to save input as a devDeps kit
      let _devDepsKit = await chooseDevDepsKit();
      let devDepsKit = _devDepsKit.split(' ');

      if (devDepsKit.length > 0) {
        await npmInstall(false, devDepsKit);
      } else {
        console.log(`No dev dependencies installed. You may want to install them manually.`);
      }
    }

    // 4. Define deps
    //   4.1. Select deps kit to install (with 'input manually' value)
    //     4.1.1. If inputted manually, offer to save input as a deps kit
    let _depsKit = await chooseDepsKit();
    let depsKit = _depsKit !== '' ? _depsKit.split(' ') : new Array(0);

    if (depsKit.length > 0) {
      await npmInstall(false, depsKit);
    } else {
      console.log(`No prod dependencies installed. You may want to install them manually.`);
    }

    // test
    return 'Dependencies Configured Successfully.';
  } catch (error) {
    return `Failed to configure dependencies: \n${error}`;
  }
}


