const inquirer = require('inquirer');
const { write, read } = require('clipboardy');

const { 
  title_locale_links,
  pages_list,
  puppeteer_confirm 
} = require('./inquirer-questions').config_webpack;
const GLOBALS = {};

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

async function askQuestions(questions, isToBeAssigned = false) {
  const _ask = () => inquirer.prompt(questions);
  const answer = await _ask();
  if (isToBeAssigned) {
    Object.assign(GLOBALS, { ...answer });
  }
  return answer;
}

// async function defineTitleLocaleLinks() {
//   const DEFINE = () => inquirer.prompt(title_locale_links);
//   const { siteTitle, siteLocale, siteLinks } = await DEFINE();
//   Object.assign(GLOBALS, { siteTitle, siteLocale, siteLinks });
// }

const defineTitleLocaleLinks = () => askQuestions(title_locale_links, true);
const definePagesList = () => askQuestions(pages_list, true);

const pasteFromClipboard = async () => await read();

module.exports = async function main() {
  // 1. Define title, locale, links (relative or absolute)
  await defineTitleLocaleLinks();

  // 2. Define site pages
  const pages = await definePagesList();

  return GLOBALS;
}