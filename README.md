# Disclaimer
This repository has been forked from https://gitlab.com/MaxIV/webjive under GPL v3 which remains in place.

This is **not** an official SKA fork and is intended as a short-term starting point for the intended work

# WebJive

## Description
With this device explorer built on TangoGQL, you can:

1. View a list of all Tango devices
2. View and modify device properties
3. View and modify device attributes
4. View and execute device commands

## Authors

WebJive was written by the KITS Group at MAX IV Laboratory.

## Requirements

This skeleton requires **Node** and **NPM** to install and run. To install these follow the instructions for your operating system at [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

Alternatively the official Node docker image can be used. Instructions can be found on the [official Node docker image site](https://github.com/nodejs/docker-node/blob/master/README.md#how-to-use-this-image).

## Installation

_All the following notes assume you are at the command prompt for your chosen environment._

1.  Confirm Node and NPM are installed and configured correctly, both the following commands should return the relevant version number.

        > node --version
        > npm --version

2.  Clone the project from GitHub

3.  Install all the necessary project dependencies by running

        > npm install

## Running and Building the Application

Scripts for running, testing, and building the application are provided as part of the standard configuration. These are run using NPM and listed in the scripts section of the package.json file.

From the project directory, you can run any of the following:

- `> npm start`

  Runs the app in the development mode at [http://localhost:3000](http://localhost:3000). The app will recompile and restart if you make any edits to the source files. Any linting errors will also be shown in the console.

- `> npm test`

  Launches the test runner in the interactive watch mode. See the [testing](#testing) section for more information.

- `> npm run build`

  Builds the app for production to the `build` folder. The build is minified and any JSX is transpiled to JavaScript. Your app is ready to be deployed!

## Testing

### Writing

We use Jest as the test running framework. It will look for test files with any of the following naming conventions:

- Files with `.js` suffix in `__tests__` folders.
- Files with `.test.js` suffix in any folder.
- Files with `.spec.js` suffix in any folder.

The .test.js / .spec.js files (or the `__tests__` folders) can be located at any depth under the src top level folder.
We recommend to put the test files or folders next to the code they are testing.

```
components
|
└─ App
   |  App.jsx
   |  App.test.jsx
```

[Enzyme](https://airbnb.io/enzyme/) and [jest-enzyme](https://www.npmjs.com/package/jest-enzyme) have been included to improve the testing framework and test readability.

See the developer guide for more information

### Running

To run the interactive test runner, execute

    > npm test

This will also watch the source files and re-run when any changes are detected

To run the tests with coverage, execute

    > npm run test:coverage

The coverage results are displayed in the console. They are also written to the `coverage` folder as:

- `lcov-report` - A coverage report as a series of html pages, open `index.html` in a web browser to view
- `clover.xml` - A clover coverage report that can be viewed in the clover code-coverage tools
- `coverage-final.json` - A json format.

**All the tests should pass before merging the code**

## Code Analysis

[ESLint](https://ESLint.org/) and [Prettier](https://prettier.io/) are included as code analysis and formatting tools.
These do not need installing as they're included in `node_modules` by running `npm install`.

These tools can be run in the command line or integrated into your IDE (recommended).

JavaScript based SKA projects must comply with the [AirBnB JavaScript Style Guide](https://github.com/airbnb/javascript). These rules are included in this project and ESLint and Prettier are configured to use them.

### Running

To run the analysis tools, execute

    > npm run code-analysis -s

This will display any errors in the command line. If there are any errors, NPM will exit with a non-zero code, the `-s` argument suppresses this and cleans up the output.

### IDE Integration

#### VS Code

Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-ESLint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions and reload the IDE.

Errors should now show in the editor. `shift + alt + F` will format a file, or you can turn on the format on save setting.

#### JetBrains (WebStorm, IntelliJ IDEA etc.)

ESLint is integrated into the Ultimate versions of all JetBrains IDEs

Prettier can be installed through a [plugin](https://plugins.jetbrains.com/plugin/10456-prettier). Follow the steps [here](https://www.jetbrains.com/help/idea/prettier.html) to configure it.

## Documentation

The documentation generator for this project is derived from SKA's [SKA Developer Portal repository](http://developer.skatelescope.org/en/latest/projects/document_project.html)

### Writing

The documentation can be edited under `./docs/src`. They're written in reStructured text (.rst).

### Building

In order to build the documentation for this specific project, execute the following under ./docs:

    > make html

or

    > docker run --rm -d -v $(pwd):/tmp -w /tmp netresearch/sphinx-buildbox sh -c "make html"

The latter requires Docker to be installed on your system but not Python, Sphinx, and other dependencies.

The documentation can then be consulted by opening the file `./docs/build/html/index.html`

