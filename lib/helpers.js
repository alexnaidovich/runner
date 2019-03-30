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