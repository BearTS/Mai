# require-text

require() text files

- [Overview](#overview)
- [Installation](#installation)
- [API](#api)
- [Development](#development)

## Overview

* Useful in Node.JS environment, which can only require .js, .json and .node files.
* Resolves and loads the file from filename just like the standard Node.JS require - does relative path resolution, etc.

## Installation

  Install with [npm](https://www.npmjs.org/package/require-text):

    $ npm install --save require-text

## API

    var requireText = require('require-text');

    var index = requireText('./index.html', require);
    // Prints contents of ./index.html file, which resides
    // in the same directory as this source code file.
    console.log(index);

## Development

#### Checklist before releasing

* package.json version number bumped
* `release X.X.X` commit created and tagged as `X.X.X`
* `npm publish`
