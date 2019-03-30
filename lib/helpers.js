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
  const _path = path.resolve(pathToDependencies);
  const mapDeps = json => {
    const devDeps = json['devDependencies'];
    const returnObj = {};
    Object.keys(devDeps).forEach(dep => {
      returnObj[dep] = `file:${_path.replace('\\', '/')}/node_modules/${dep}`;
    });
    return returnObj;
  }
  const getDeps = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(_path, (err, files) => {   
        if (err) {
          reject(err);
        } else if (!files.find(file => file === 'package.json')) {
          reject(`No 'package.json' found at the folder ${_path}.`);
        } else {
          const devDeps = require(path.join(_path, 'package.json'));
          resolve(mapDeps(devDeps));
        }
      });
    });
  }

  return getDeps();
}

module.exports.npmInit = () => {
  // TODO
}

module.exports.npmInstall = () => {
  // TODO
}