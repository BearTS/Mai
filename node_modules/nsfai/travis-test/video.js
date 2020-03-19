// Test video script for use with Travis CI

var NSFAI = require("../index");

var nsfai = new NSFAI(process.env.NSFAI_CLARIFAI_KEY);

nsfai.predict("https://bbyjins.skiilaa.me/img/test.gif", { video: true }).then(function(result) {
    console.log(result);
}).catch(function(error) {
    var censoredError = error;
    censoredError.request._header = "<hidden>";
    console.error(censoredError);
    process.exit(1);
});