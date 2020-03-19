exports.http = require('http')
exports.https = require('https')
exports.URL = require('url').URL
exports.btoa = b => Buffer.from(b).toString('base64')
