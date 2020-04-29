const { connection } = require('mongoose')


module.exports.loadguilddata = (client) => {

  connection.db.collection('guildprofiles', (err, document) => {
    if (err) return console.log(`Unexpected Error Occured`)
    document.find({}).toArray( (e , res) => {
      if (e) return console.log(`Unexpected Error Occured (2)`)
      res.forEach( guildData => {
        client.guildsettings.set(guildData.guildID, guildData)
      })
    })
  })
}
