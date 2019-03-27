const chalk = require('chalk');
const { version, author } = require('../package.json');

module.exports = () => {
  console.log(
    chalk.green(`Runner v.${version} by ${author}.`)
  );
  console.log(
    chalk.yellow(`Let's configure your boilerplate.`)
  );
}
