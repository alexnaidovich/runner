const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { exec } = require('child_process');
const path = require('path');
const dir_config = path.resolve(__dirname, '..', 'config');

/**
 * 
 * @param {NodeJSException} error 
 * @private
 */
function handleErrorWithoutSuccessCallback(error) {
  if (error) {
    console.log(chalk.red(error));
  }
}

/**
 * Rewrites configuration file (save current settings)
 * 
 * @param {Object} json Config object
 * @param {String} typeOfConfig Config type (which config file to edit)
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

/**
 * Gets path to pre-installed devDependencies and and returns 'devDependencies' object
 * linked to those packages for new 'package.json' output.
 * 
 * @param {String} pathToDependencies Path to installed npm packages
 * @returns {Promise<Object | String<Error>>} Resolved mapped devDeps or rejected error message 
 */
module.exports.scanCachedDevDependencies = pathToDependencies => {
  const _path = path.resolve(pathToDependencies);

  const mapDeps = devDeps => {
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
          const { devDependencies } = require(path.join(_path, 'package.json'));
          resolve(mapDeps(devDependencies));
        }
      });
    });
  }

  return getDeps();
}

/**
 * Performs 'npm install'.
 * Returns resolved promise on success or rejected promise on failure.
 * 
 * @param {Boolean} isDevDeps defines if the deps are dev (true) or prod (false).
 * @param {Array} deps Array of packages
 * @returns {Promise<Boolean> | Promise<String>} 
 */
module.exports.npmInstall = (isDevDeps, deps = []) => {
  let _deps = deps.length ? deps.join(' ') : '';
  let _savedev = isDevDeps ? '--save-dev' : '--save';
  return new Promise((resolve, reject) => {
    const spinner = ora('Installing dependencies via npm install. It may take a while...').start();
    const npminstall = exec(`npm install --verbose ${_savedev} ${_deps}`, (error, stdout, stderr) => {
      if (error) {
        spinner.stop();
        console.log(error);
        reject(error);
      }      
    });
    npminstall.on('message', message => process.stdout.write(message));
    npminstall.on('exit', (code, signal) => {
      if (code !== 0) {
        spinner.stop();
        reject(`Exit child process with non-zero code: ${code};\n${signal}`);
      } else {
        console.log(chalk.yellow(`\nnpm install finished with code ${code} and status ${signal}`));
        spinner.stop();
        resolve(true);
      }
    })
  });
}

/**
 * Stores 'package.json' file on disc
 * 
 * @param {Object} package_json 'package.json' content
 * @returns {Promise<String>} Promise containing state of file saving
 */
module.exports.savePackageJson = package_json => {
  const cwd = process.cwd();
  return new Promise((resolve, reject) => {
    fs.writeFile(`${cwd}/package.json`, JSON.stringify(package_json, null, 2), error => {
      if (error) {
        reject(error);
      }
      resolve(`"package.json" saved.`);
    });
  });
}