const path = require('path');
const dir_config = path.resolve(__dirname, '..', 'config');
const [ deps_config ] = [
  'deps.config.json'
].map(config => require(path.join(dir_config, config)));

module.exports = {
  config_dependencies: {
    author_pick: [
      {
        type: "list",
        message: "Pick an author",
        name: "_author",
        choices: deps_config.defaultAuthors.concat("input manually")
      }
    ],
    author_input: [
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
    ],
    name_and_description: [
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
    ],
    is_dev_deps_cached: [
      {
        type: "confirm",
        message: "Are your devDependencies installed somewhere globally?",
        name: "isDevDepsCached",
        default: deps_config.isDevDepsCached || false
      }
    ],
    choose_dev_deps_kit: [
      {
        type: "list",
        message: "Choose your devDependencies kit",
        name: "chooseDevDepsKit",
        choices: deps_config.devDepsKits.concat("input manually")
      }
    ],
    input_dev_deps: [
      {
        type: "input",
        message: "Enter package names of your devDependencies separated by whitespace: ",
        name: "inputDevDeps"
      },
      {
        type: "confirm",
        message: "Do you want to save your devDependencies kit?",
        name: "saveDevDepsKit",
        default: true
      }
    ],
    choose_dev_deps_cached_path: [
      {
        type: "list",
        message: "Where are your devDependencies installed?",
        name: "chooseDevDepsCachePath",
        choices: deps_config.devDepsCachePaths.concat("input manually")
      }
    ],
    input_dev_deps_cache_path: [
      {
        type: "input",
        message: "Input an absolute path to your devDepeidencies: ",
        name: "inputDevDepsCachePath"
      }, 
      {
        type: "confirm",
        message: "Do you want to save this path?",
        name: "saveDevDepsCachePath",
        default: true
      }
    ]
  },
}