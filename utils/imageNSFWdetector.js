var NSFAI = require('nsfai');
const settings = require('./../botconfig.json')
var nsfai = new NSFAI(settings.APIKeys.nsfai);


module.exports = function isNSFW(url) {
  return new Promise ((resolve,reject)=>{
    nsfai.predict(url).then(result => {
    resolve(result)
    })
  })
}
