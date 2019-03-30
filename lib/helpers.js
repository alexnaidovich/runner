const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { exec } = require('child_process');
const path = require('path');
const dir_config = path.resolve(__dirname, '..', 'config');

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
module.exports.rewriteSettings = (json, typeOfConfig, keyToReplace, valueToReplace) => {  
  function replaceValue(_key, _currentValue) {
    if (_key === keyToReplace) {
      return valueToReplace;
    }
    return _currentValue;
  }
  fs.writeFile(`${dir_config}/${typeOfConfig}.config.json`, JSON.stringify(json, replaceValue, 2), handleErrorWithoutSuccessCallback);
}

module.exports.scanCachedDevDependencies = pathToDependencies => {
  // TODO
}

module.exports.npmInit = () => {
  // TODO
}

module.exports.npmInstall = () => {
  // TODO
}