const inquirer = require('inquirer');

const { 
  title_locale_links 
} = require('./inquirer-questions').config_webpack;
const GLOBALS = {};

async function defineTitleLocaleLinks() {
  const DEFINE = () => inquirer.prompt(title_locale_links);
  const { siteTitle, siteLocale, siteLinks } = await DEFINE();
  Object.assign(GLOBALS, { siteTitle, siteLocale, siteLinks });
}

module.exports = async function main() {
  // 1. Define title, locale, links (relative or absolute)
  await defineTitleLocaleLinks();

  return GLOBALS;
}