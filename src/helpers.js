const fs = require('fs');
const chalk = require('chalk');
const { exec } = require('child_process');

/**
 * 
 * @param {NodeJSException} error 
 */
function handleErrorWithoutSuccessCallback(error) {
  if (error) {
    console.log(chalk.red(error));
  }
}

/**
 * 
 * 
 * @param {Object} json
 * @param {String} keyToReplace
 * @param {any} valueToReplace
 */
module.exports.rewriteSettings = (json, keyToReplace, valueToReplace) => {
  function replaceValue(_key, _currentValue) {
    if (_key === keyToReplace) {
      return valueToReplace;
    }
    return _currentValue;
  }
  fs.writeFile(`settings.json`, JSON.stringify(json, replaceValue, 2), handleErrorWithoutSuccessCallback);
}

module.exports.npmInit = () => {
  // TODO
}

module.exports.npmInstall = () => {
  // TODO
}