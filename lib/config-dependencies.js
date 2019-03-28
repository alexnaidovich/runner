const inquirer = require('inquirer');
const CONFIG = require('../config/deps.config.json');
const { rewriteSettings } = require('./helpers');
const package_json = {};

async function defineAuthor() {
  const questions_PICK = [
    {
      type: "list",
      message: "Pick an author",
      name: "_author",
      choices: CONFIG.defaultAuthors.concat("input manually")
    }
  ];
  const questions_INPUT = [
    {
      type: "input",
      message: "Input your name",
      name: "author"
    },
    {
      type: "confirm",
      message: "Do you want your name to be saved?",
      name: "storeName",
      default: true
    }
  ];

  const PICK = () => inquirer.prompt(questions_PICK);
  const INPUT = () => inquirer.prompt(questions_INPUT);

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
  const questions = [
    {
      type: "input",
      message: "Input the name of your project",
      name: "name",
      validate: value => value !== "" && !(/[^a-zA-Z0-9\-]/g.test(value))
    },
    {
      type: "input",
      message: "Input the description of your project",
      name: "description"
    }
  ]

  const INPUT = () => inquirer.prompt(questions);
  const { name, description } = await INPUT();
  Object.assign(package_json, { name, description });

  return [ name, description ];
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

  // test
  return [ author, name, description, JSON.stringify(package_json, null, 2) ];

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
}


