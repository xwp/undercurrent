![Undercurrent](https://raw.githubusercontent.com/xwp/artwork/master/undercurrent/banner-white-blue.jpg)

[![Build Status](https://travis-ci.com/xwp/undercurrent.svg?token=oAggoNR8iywASwLW3E52&branch=master)](https://travis-ci.com/xwp/undercurrent)

# Undercurrent

A slightly oppiniated but hightly configurable build system using Gulp and Webpack for optimized frontend tooling, development and testing.

## Installation

```
yarn add undercurrent
```

```
npm install undercurrent
```

## Usage

Undercurrent comes with a default schema and tasks:

- `clean`: clears the `dist` directory in assets.
- `copy`: copies any font from `assets/fonts`;
- `images`: minifies images.
- `css`: builds CSS from SCSS using PostCSS for transformations and also provides linting using Stylelint.
- `js`: build JS using Webpack and runs ESLint and a Babel loader.

Within the `package.json` of your project, you simply need to add a `script` to run Undercurrent:

```
cross-env NODE_ENV=development gulp --gulpfile $(npm root)/undercurrent/src/index.js --cwd $(npm prefix)
```

This script would run using the default schema and workflow; however, you can provide write your own workflow, schema and tasks.
