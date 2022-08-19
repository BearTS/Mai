'use strict';

const { version } = require('../package.json');

exports.error = `\x1b[35mMai@${version} \x1b[31mERR! \x1b[41m\x1b[37m%s\x1b[0m`;
exports.info = `\x1b[35mMai@${version} \x1b[36mINFO\x1b[0m`;
exports.warn = `\x1b[35mMai@${version} \x1b[30m\x1b[43mWARN\x1b[0m \x1b[35m%s\x1b[0m`;
exports.success = `\x1b[35mMai@${version} \x1b[32mOK!\x1b[0m`;
exports.colors = {};
exports.colors.foreground = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};
exports.colors.background = {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
};
exports.styles = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse:'\x1b[7m',
    hidden:'\x1b[8m',
};
